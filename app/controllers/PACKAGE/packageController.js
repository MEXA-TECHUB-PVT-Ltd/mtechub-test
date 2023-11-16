const { pool } = require("../../config/db.config");
const logStripeAction = require("../../maintainLog");
const { SECRET_KEY, PUBLISHABLE_KEY } = require('../../stripe_keys');
const stripe = require('stripe')(SECRET_KEY)
exports.createPackage = async (req, res, next) => {

    const client = await pool.connect();
    try {
        const {
            package_name,
            program_id,
            package_price,
            type,
            stripe_payment_link,
            feature,
            description

        } = req.body;
        // const company_user = false;
        if (program_id === null || program_id === "" || program_id === undefined) {
            res.json({ error: true, message: "Please Provide Program Id " });

        } else {
          
          
                    const userData = await pool.query("INSERT INTO packages(package_name,program_id,package_price,type,description,stripe_payment_link) VALUES($1,$2,$3,$4,$5,$6) returning *",
                        [
                            package_name,
                            program_id,
                            package_price,
                            type,
                            description,
                            // feature,
                            stripe_payment_link
                        ])
                    if (userData.rows.length === 0) {
                        res.json({ error: true, data: [], message: "Can't Create Package" });


                    } else {
                        // logStripeAction('Create Price', [{ name: package_name, price: package_price, description, type }], [{ result: product }], 'success');

                        const data = userData.rows[0]
                        res.json({
                            error: false, data: {
                                // publishableKey: PUBLISHABLE_KEY,
                                prices: data,
                            }, message: "Pricing Created Successfully"
                        });

                    }
        }
    }
    catch (err) {
        res.json({ error: true, data: err, message: "Catch eror" });

    } finally {
        client.release();
    }

}
exports.updatePackage = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            package_id,
            package_name,
            package_price,
            stripe_payment_link,
            feature,
            description

        } = req.body;
        // const company_user = false;
        if (package_id === null || package_id === "" || package_id === undefined) {
            res.json({ error: true, message: "Please Provide Product Id " });

        } else {
            let query = 'UPDATE packages SET ';
            let index = 2;
            let values = [package_id];

            if (package_name) {
                query += `package_name = $${index} , `;
                values.push(package_name)
                index++
            }
            if (package_price) {
                query += `package_price = $${index} , `;
                values.push(package_price)
                index++
            }
            if (stripe_payment_link) {
                query += `stripe_payment_link = $${index} , `;
                values.push(stripe_payment_link)
                index++
            }
            if (feature) {
                query += `feature = $${index} , `;
                values.push(feature)
                index++
            }
            if (description) {
                query += `description = $${index} , `;
                values.push(description)
                index++
            }
            query += 'WHERE package_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)

            if (result.rows.length === 0) {
                res.json({ error: true, data:[], message: "Something Went Wrong" });

            }else{
                res.json({ error: false, data: result.rows, message: "Price Updated Successfully" });

            }

          
        }




    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deletePackage = async (req, res) => {
    const client = await pool.connect();
    try {
        const {package_id}=req.body
        const deleteUserQuery = await pool.query(
            "DELETE FROM packages WHERE package_id=$1",[
                package_id
            ]
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Package" });

        } else {
            res.json({ error: false, message: "Package Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteAllPackage = async (req, res) => {
    const client = await pool.connect();
    try {
        const deleteUserQuery = await pool.query(
            "DELETE FROM Packages"
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Package" });

        } else {
            res.json({ error: false, message: "All Package Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.getAllCustomers = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            user_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM users WHERE user_id <> $1 '
        const result = await pool.query(query, [user_id]);
        // get messages 
        // const Data= result.rows
        const Data = result.rows.filter(user => user.type !== 'admin');
        let Array = [];
        for (let i = 0; i < Data.length; i++) {
            const customerId = Data[i].user_id
            const queryText = `
            SELECT sender = $1 AS from_self, message AS message,type AS type,
            readStatus AS readStatus,
            created_at AS created_at
            FROM messages
            WHERE (sender = $1 AND to_user = $2) OR (sender = $2 AND to_user = $1)
            ORDER BY created_at ASC 
          `;

            let resultMessages = await client.query(queryText, [user_id, customerId]);
            // Filter the array to get objects with readstatus false and from_self false
            const filteredResults = resultMessages.rows.filter((row) => {
                return row.readstatus === "false" && row.from_self === false;
            });
            Array.push({
                user_id: Data[i].user_id,
                email: Data[i].email,
                password: Data[i].password,
                image: Data[i].image,
                user_name: Data[i].user_name,
                uniq_id: Data[i].uniq_id,
                unreadMessages: filteredResults.length
            })
        }


        if (result.rows) {
            res.json({
                message: "All Users Fetched",
                status: true,
                result: Array
            })
        }
        else {
            res.json({
                message: "could not fetch",
                status: false,
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}
exports.getPackageByProductId = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            program_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM packages WHERE program_id =$1 '
        const result = await pool.query(query, [program_id]);

        const query1 = 'SELECT * FROM programs WHERE program_id =$1 '
        const result1 = await pool.query(query1, [program_id]);

        const query2 = 'SELECT * FROM product_videos WHERE program_id =$1 '
        const result2 = await pool.query(query2, [program_id]);
        // get messages 
        const Data = result1.rows[0]//product
        res.json({
            error: false, data: {
                // publishableKey: PUBLISHABLE_KEY,
                prices: result.rows,
                videos:result2.rows,
                program:Data,
            }, message: "Pricing Get Successfully"
        });
        //     }
        // });
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}
exports.getPackageByPriceId = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            price_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM packages WHERE stripe_price_id =$1 '
        const result = await pool.query(query, [price_id]);
        // get product 
        const program_id = result.rows[0].program_id
        const query1 = 'SELECT * FROM products WHERE program_id =$1 '
        const result1 = await pool.query(query1, [program_id]);
        // const prices = await stripe.prices.list({
        //     // lookup_keys: ['Monthly', 'sample_premium'],
        //     // lookup_keys: ['standard-monthly'],
        //     product: program_id,
        //     expand: ['data.product'],
        //     active: true
        // });
        // get messages 
        // const Data= result.rows

        // const productData = {
        //     product: program_id,
        //     expand: ['data.product'],

        // };
        // const price = await stripe.prices.retrieve(
        //     price_id
        //   );
        stripe.prices.retrieve(price_id, (err, product) => {
            if (err) {
                console.error(err);
            } else {
                res.json({
                    error: false, data: {
                        publishableKey: PUBLISHABLE_KEY,
                        prices: product,
                        dbPrice:result.rows[0],
                        product:result1.rows[0]

                    }, message: "Pricing Get Successfully"
                });
            }
        });
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
    }
}



