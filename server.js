
const express = require('express');
const app = express();
const crypto = require("crypto");

const PORT =  5000;
const bodyParser = require('body-parser');
require('dotenv').config()
const cors = require("cors");
const { SECRET_KEY, PUBLISHABLE_KEY } = require('./app/stripe_keys');
const { pool } = require('./app/config/db.config');
const EmailLinkButton = require('./app/EmailLinkButton');
const { login_url } = require('./app/urls');
const stripe = require('stripe')(SECRET_KEY)

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use('/uploads', express.static('uploads'))

app.use('/upload-image', require('./app/upload-image'))

app.use("/user", require("./app/routes/Users/customerRoute"))
// Products 
// app.use("/product", require("./app/routes/Product/productRoute"))
// // Product Package 
// //Package Features
// app.use("/features", require("./app/routes/Features/featuresRoute"))
// // Logs 
// app.use("/logs", require("./app/routes/Logs/logsRoute"))
// make api for just say server is running when runs localhost:5000 on google 
app.get("/", (req, res) => {
  res.status(200).json({ error: false, message: "Server is running" });


});
// company
app.use("/company", require("./app/routes/FeaturedCompanies/featuredCompaniesRoute"))
app.use("/contact_us", require("./app/routes/ContactUs/ContactUs"))
app.use("/program", require("./app/routes/Programs/Programs"))
app.use("/package", require("./app/routes/Package/PackageRoute"))
app.use("/program_videos", require("./app/routes/ProgramVideos/ProgramVideos"))


// zaxsdcvbgnhjm




// Stripe 
// create product 
// create price list 
app.post('/create-product', async (req, res) => {
  // "Unlimited Searches;Access to all gpt engine;AnyFeature 3" 
  // split by semi colon 
  const prices = await stripe.products.create({
    name: req.body.name,
    description: req.body.description,

  });

  res.send({
    publishableKey: PUBLISHABLE_KEY,
    prices: prices,
  });
});

// true checkout using 
function generateRandomPassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const password = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password.push(charset[randomIndex]);
  }

  return password.join('');
}


//  Checkout Functions 
// Function to create a new customer if they don't exist
async function createCustomer(email, username, paymentMethodId) {
  try {
    const customer = await stripe.customers.create({
      email: email,
      name: username,
      payment_method: paymentMethodId,
      metadata: {
        userId: "1234"
      }
    });
    const result = await pool.query(`SELECT * FROM users WHERE email='${email}'`);
    const user_id = result.rows[0].user_id;
    // update stripe customer id 
    const stripe_customer_id = customer.id
    let query = 'UPDATE users SET ';
    let index = 2;
    let values = [user_id];

    if (stripe_customer_id) {
      query += `stripe_customer_id = $${index} , `;
      values.push(stripe_customer_id)
      index++
    }

    query += 'WHERE user_id = $1 RETURNING*'
    query = query.replace(/,\s+WHERE/g, " WHERE");
    const updatedResult = await pool.query(query, values)
    return customer;
  } catch (error) {
    throw error;
  }
}

// Function to create a new user in the database
async function createUser(username, email, hashedPassword, customerId) {
  try {
    const dataUser = await pool.query("INSERT INTO users(user_name,email,password,stripe_customer_id) VALUES($1,$2,$3,$4) returning *",
      [username, email, hashedPassword, customerId]);
    return dataUser.rows[0].user_id;
  } catch (error) {
    throw error;
  }
}

// Function to retrieve an existing customer
async function getExistingCustomer(email) {
  try {
    const existingCustomer = await stripe.customers.list({ email });

    return existingCustomer;
  } catch (error) {
    throw error;
  }
}

// Function to handle payment method attachment
async function attachPaymentMethod(paymentMethodId, customerId) {
  try {
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
  } catch (error) {
    throw error;
  }
}

// Function to update customer's default payment method
async function updateDefaultPaymentMethod(customerId, paymentMethodId) {
  try {
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });
  } catch (error) {
    throw error;
  }
}

// Function to create a new subscription
async function createSubscription(customerId, priceId, user_id) {
  try {
    if (!priceId) {
      throw new Error("Price ID is missing");
    }
    // get product from price id 
    const query1 = 'SELECT * FROM packages WHERE stripe_price_id =$1'
    const result1 = await pool.query(query1, [priceId]);
    const product_id = result1.rows[0].product_id;
    // get product stripe id from product 
    const query2 = 'SELECT * FROM products WHERE product_id =$1'
    const result2 = await pool.query(query2, [product_id]);
    const ProductIdStripe = result2.rows[0].product_id_stripe;


    // check this subscription exist or not
    const query = 'SELECT * FROM subscriptions WHERE stripe_product_id =$1 AND user_id=$2'
    const result = await pool.query(query, [ProductIdStripe, user_id]);
    if (result.rows.length === 0) {
      // end 
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }]
      });
      return subscription;
    } else {
      return null
    }


  } catch (error) {
    throw error;
  }
}
// Function to handle successful subscription creation
async function handleSuccessfulSubscriptionCreation(subscription_id, upgrade, password, email, user_id, req, res, subscription) {
  try {
    console.log("handleSuccessfulSubscriptionCreation")
    console.log(user_id)

    const price_id = req.body.priceId;
    const payment_method_id = req.body.paymentMethodId;
    const status = subscription.status;
    const stripe_subscription_id = subscription.id;
    const type = subscription.plan.interval;
    // get product from price id 
    const query = 'SELECT * FROM packages WHERE stripe_price_id =$1'
    const result = await pool.query(query, [price_id]);
    const price_id_db = result.rows[0].package_id;
    const product_id = result.rows[0].product_id;
    // get product stripe id from product 
    const query2 = 'SELECT * FROM products WHERE product_id =$1'
    const result2 = await pool.query(query2, [product_id]);
    const ProductIdStripe = result2.rows[0].product_id_stripe;
    if (upgrade) {
      //  inactive all other previous subscription of user 
      const query3 = 'UPDATE subscriptions SET status=$1 WHERE subscription_id=$2 '
      const result3 = await pool.query(query3, ["inactive", subscription_id]);

    }

    // subscription 
    const subscriptionDB = await pool.query("INSERT INTO subscriptions(product_id,stripe_price_id,user_id,type,status,payment_method_id,stripe_subscription_id,price_id,stripe_product_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *",
      [product_id, price_id, user_id, type, status, payment_method_id, stripe_subscription_id, price_id_db, ProductIdStripe]);

    const data = subscriptionDB.rows[0];

    res.status(200).json({
      success: true,
      subscriptionObject: subscription,
      dbSubscription: data,
      message: "Subscription created successfully",
    });
    // Email to user 
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const subject = "Subscription Successful"
    const resetLink = login_url
    const buttonText = "User Portal"

    const message = "Congratulations! You have successfully subscribed to Zipto .We are excited to have you on board and we promise to provide you with the best service possible. If you have any questions or need assistance with your new subscription, please do not hesitate to contact us.Thank you for choosing our service."
    // res.json({ error: false, otp: otp, message: "Email Sent Successfully" });
    EmailLinkButton(email, resetLink, buttonText, subject, password, message)

  } catch (error) {
    throw error;
  }
}

// Function to handle incomplete subscription
async function handleIncompleteSubscription(subscription) {
  try {
    const latestInvoice = subscription.latest_invoice;
    const invoice = await stripe.invoices.retrieve(latestInvoice);
    const paymentIntentId = invoice.payment_intent;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const paymentIntentStatus = paymentIntent;

    console.log('Payment Intent Status:', paymentIntentStatus);

    // Additional logic for handling incomplete subscription
    // ...

  } catch (error) {
    throw error;
  }
}

// Function to handle other subscription statuses
async function handleOtherSubscriptionStatuses(res) {
  res.status(400).json({
    error: true,
    message: "Something went wrong with the subscription",
  });
}
// Function to handle the checkout process
app.post("/checkout", async (req, res) => {
  const email = req.body.customeremail;
  const username = email.split('@')[0];
  const paymentMethodId = req.body.paymentMethodId;
  //   upgrade
  // StripeSubsId
  // SubsId
  const passwordLength = 12; // You can change the length as needed
  const randomPassword = generateRandomPassword(passwordLength);

  const salt = "mySalt";
  const hashedPassword = crypto
    .createHash("sha256")
    .update(randomPassword + salt)
    .digest("hex");

  try {
    const existingCustomer = await getExistingCustomer(email);
    let customer, user_id;

    if (existingCustomer.data.length === 0) {
      customer = await createCustomer(email, username, paymentMethodId);
      // user_id = await createUser(username, email, hashedPassword, customer.id);
    } else {
      customer = existingCustomer.data[0];
      const result = await pool.query(`SELECT * FROM users WHERE email='${email}'`);
      user_id = result.rows[0].user_id; //issue 
      console.log("user_id")
      console.log(result.rows)

      // update stripe customer id 
      const stripe_customer_id = customer.id
      let query = 'UPDATE users SET ';
      let index = 2;
      let values = [user_id];

      if (stripe_customer_id) {
        query += `stripe_customer_id = $${index} , `;
        values.push(stripe_customer_id)
        index++
      }

      query += 'WHERE user_id = $1 RETURNING*'
      query = query.replace(/,\s+WHERE/g, " WHERE");
      const updatedResult = await pool.query(query, values)
      // end 

    }

    await attachPaymentMethod(paymentMethodId, customer.id);
    await updateDefaultPaymentMethod(customer.id, paymentMethodId);
    // check product Id 


    const subscription = await createSubscription(customer.id, req.body.priceId, user_id);
    if (subscription === null) {
      // res.json({ error: true, message: "Subscription Already Exist For this Product .Upgrade from User Portal." });
      //  upgrade subscription 
      try {
        // Get the customer ID from the email
        const customer = await stripe.customers.list({ email, limit: 1 });
        const customerId = customer.data[0].id;
        if (req.body.upgrade) {
          // Get the current subscription for the customer
          //  const deleted = await stripe.subscriptions.cancel('sub_1OCbXU2eZvKYlo2ChcEIT9Ja');
          // const currentSubscription = await stripe.subscriptions.list({
          //   customer: customerId,
          //   status: 'active',
          //   limit: 1,
          // });

          // Cancel the current subscription
          await stripe.subscriptions.del(req.body.StripeSubsId);
        }


        // Create a new subscription with the new price and payment method
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: req.body.priceId }],
          default_payment_method: paymentMethodId,
        });
        console.log("activated")
        console.log(user_id)
        await handleSuccessfulSubscriptionCreation(req.body.SubsId, req.body.upgrade, randomPassword, email, user_id, req, res, subscription);


      } catch (error) {
        console.error(error);
      }

    } else {
      if (subscription.status === "active") {
        console.log("active")
        console.log(user_id)

        // Handle successful subscription creation
        await handleSuccessfulSubscriptionCreation(req.body.SubsId, req.body.upgrade,randomPassword, email, user_id, req, res, subscription);
        // ...
      } else if (subscription.status === "incomplete") {
        // Handle incomplete subscription
        await handleIncompleteSubscription(subscription);
        // ...
      } else {
        // Handle other subscription statuses
        await handleOtherSubscriptionStatuses(res);
        // ...
      }
    }


  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({
      error: true,
      message: error.message
    });
  }
});

// const server =
app.listen(5000, () => {
  console.log(`
################################################
       Server listening on port: ${PORT}
################################################
`);
});




