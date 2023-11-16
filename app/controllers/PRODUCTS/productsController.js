const { pool } = require("../../config/db.config");
const { SECRET_KEY, PUBLISHABLE_KEY } = require('../../../app/stripe_keys');
const logStripeAction = require("../../maintainLog");
const stripe = require('stripe')(SECRET_KEY)
exports.createProduct = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { image, product_name, description, product_id_stripe, price, features } = req.body;

        if (!product_id_stripe) {
            return res.status(400).json({ error: true, message: "Please Provide product_id_stripe" });
        }

        // Create the product on Stripe
        // const productData = {
        //     name: product_name,
        //     description: description,
        //     images: [`https://res.cloudinary.com/dxfdrtxi3/image/upload/v1696830378/women_cycle_logo_ynikjg.png`],
        //     // Add other product attributes as needed
        // };

        // stripe.products.create(productData, async (err, product) => {
        // if (err) {
        //     logStripeAction('Create Product', [{ name: product_name, description }], [{ result: product }], 'error');
        //     return res.status(500).json({ error: true, message: "Failed to create product on Stripe" });
        // }

        // Insert product into the database
        const userData = await pool.query("INSERT INTO products(image,product_name,description,product_id_stripe,price,features) VALUES($1,$2,$3,$4,$5,$6) returning *",
            [image || null, product_name, description || null, product_id_stripe, price, features]
        );

        const data = userData.rows[0];
        // logStripeAction('Create Product', [{ name: product_name, description }], [{ result: product }], 'success');

        res.status(200).json({
            error: false,
            data: {
                publishableKey: PUBLISHABLE_KEY,
                products: data,
            },
            message: "Product Created Successfully",
        });
        // });
    } catch (err) {
        // logStripeAction('Create Product', [{ name: product_name, description }], [{ result: null }], 'error');
        res.status(500).json({ error: true, data: [], message: "Catch error" });
    } finally {
        client.release();
    }
};
exports.updateProduct = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            product_id,
            image,
            product_name,
            description

        } = req.body;
        // const company_user = false;
        if (product_id === null || product_id === "" || product_id === undefined) {
            res.json({ error: true, message: "Please Provide Product Id" });

        } else {
           
            let query = 'UPDATE products SET ';
            let index = 2;
            let values = [product_id];

            if (image) {
                query += `image = $${index} , `;
                values.push(image)
                index++
            }
            if (product_name) {
                query += `product_name = $${index} , `;
                values.push(product_name)
                index++
            }
            if (description) {
                query += `description = $${index} , `;
                values.push(description)
                index++
            }
            query += 'WHERE product_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)
            if(result.rows.length===0){
            res.json({ error: true, data: [], message: "Something Went Wrong" });

            }else{

            }
            res.json({ error: false, data: result.rows[0], message: "Product Updated Successfully" });



            // if (result.rows.length === 0) {
            //     res.json({ error: true, data: [], message: "Something went wrong" });

            // } else {
            //     res.json({ error: false, data: result.rows, message: "Product Updated Successfully" });

            // }

        }

    }
    catch (err) {
        // let request_data = [{
        //     product_id: req.body.product_id,
        //     name: req.body.product_name,
        //     description: req.body.description,
        // }]
        // let response_data = [{
        //     result: null,
        // }]
        // console.log(err);
        // logStripeAction('Update Product',
        //     request_data,
        //     response_data,
        //     'error'
        // )
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
    // UPDATE
    // try {
    //     const {product_id, image, product_name, description } = req.body;

    //     if (!product_id) {
    //         return res.status(400).json({ error: true, message: "Please Provide Product Id" });
    //     }

    //     // Create the product on Stripe
    //     const productData = {
    //         name: product_name,
    //         description: description,
    //         // Add other product attributes as needed
    //     };

    //     stripe.products.update(product_id,productData, async (err, product) => {
    //         if (err) {

    //         logStripeAction('Update Product', [{ name: product_name, description, product_id:product_id }], [{ result: product }], 'error');
    //             return res.status(500).json({ error: true, message: "Failed to update product on Stripe" });
    //         }

    //         // update 
    //         let query = 'UPDATE products SET ';
    //         let index = 2;
    //         let values = [product_id];

    //         // if (image) {
    //         //     query += `image = $${index} , `;
    //         //     values.push(image)
    //         //     index++
    //         // }
    //         if (product_name) {
    //             query += `product_name = $${index} , `;
    //             values.push(product_name)
    //             index++
    //         }
    //         if (description) {
    //             query += `description = $${index} , `;
    //             values.push(description)
    //             index++
    //         }
    //         query += 'WHERE product_id = $1 RETURNING*'
    //         query = query.replace(/,\s+WHERE/g, " WHERE");


    //         const result = await pool.query(query, values)
    //         // end 

    //         const data = result.rows[0];
    //         logStripeAction('Update Product', [{ name: product_name, description, product_id:product_id  }], [{ result: product }], 'success');

    //         res.status(200).json({
    //             error: false,
    //             data: {
    //                 publishableKey: PUBLISHABLE_KEY,
    //                 prices: product,
    //             },
    //             message: "Product Update Successfully",
    //         });
    //     });
    // } catch (err) {
    //     logStripeAction('Update Product', [{ name: product_name, description , product_id:product_id }], [{ result: null }], 'error');
    //     res.status(500).json({ error: true, data: [], message: "Catch error" });
    // } finally {
    //     client.release();
    // }

}
exports.archieveProduct = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            product_id,
            active

        } = req.body;
        // const company_user = false;
        if (product_id === null || product_id === "" || product_id === undefined) {
            res.json({ error: true, message: "Please Provide Product Id" });

        } else {
            const product = await stripe.products.update(
                product_id,
                {
                    active: active,
                }
            );
            let request_data = [{
                product_id: product_id,
                active: active
            }]
            let response_data = [{
                result: product,
            }]
            logStripeAction('Upate Product',
                request_data,
                response_data,
                'success'
            )
            res.json({ error: false, data: product, message: "Product Updated Successfully" });

            // let query = 'UPDATE products SET ';
            // let index = 2;
            // let values = [product_id];

            // if (image) {
            //     query += `image = $${index} , `;
            //     values.push(image)
            //     index++
            // }
            // if (product_name) {
            //     query += `product_name = $${index} , `;
            //     values.push(product_name)
            //     index++
            // }
            // if (description) {
            //     query += `description = $${index} , `;
            //     values.push(description)
            //     index++
            // }
            // query += 'WHERE product_id = $1 RETURNING*'
            // query = query.replace(/,\s+WHERE/g, " WHERE");


            // const result = await pool.query(query, values)

            // if (result.rows.length === 0) {
            //     res.json({ error: true, data: [], message: "Something went wrong" });

            // } else {
            //     res.json({ error: false, data: result.rows, message: "Product Updated Successfully" });

            // }

        }

    }
    catch (err) {
        let request_data = [{
            product_id: product_id,
            active: active,
        }]
        let response_data = [{
            result: null,
        }]
        console.log(err);
        logStripeAction('Update Product',
            request_data,
            response_data,
            'error'
        )
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteProduct = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            product_id,
        } = req.body;
        // const company_user = false;
        if (product_id === null || product_id === "" || product_id === undefined) {
            res.json({ error: true, message: "Please Provide Product Id" });

        } else {

            const deleteUserQuery = await pool.query(
                "DELETE FROM products WHERE product_id = $1",
                [product_id]
            );

            // Check if any rows were deleted
            if (deleteUserQuery.rowCount === 1) {
                res.json({ error: false, message: "Product Deleted Successfully" });
            } else {
                res.json({ error: true, message: "Cannot Delete Product" });
            }

        }

    }
    catch (err) {
        let request_data = [{
            product_id: product_id,
        }]
        let response_data = [{
            result: null,
        }]
        console.log(err);
        logStripeAction('Delete Product',
            request_data,
            response_data,
            'error'
        )
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteAllProduct = async (req, res) => {
    const client = await pool.connect();
    try {

        const deleteUserQuery = await pool.query(
            "DELETE FROM products"
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Product" });

        } else {
            res.json({ error: false, message: "All Product Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}

exports.getAllProducts = async (req, res) => {
    const client = await pool.connect();
    try {
        const query = 'SELECT * FROM products ORDER BY created_at DESC'
        const result = await pool.query(query);
        let UpdatedArray = []
        let Array = result.rows
        for (let i = 0; i < Array.length; i++) {
            const ProductId = Array[i].product_id
            const query1 = 'SELECT * FROM subscriptions WHERE product_id=$1'
            const result1 = await pool.query(query1, [ProductId]);
            let SubscriptionCount = result1.rows.length
            let ObjectData = {
                product_id: Array[i].product_id,
                product_name: Array[i].product_name,
                product_id_stripe: Array[i].product_id_stripe,
                price: Array[i].price,
                image: Array[i].image,
                description: Array[i].description,
                features: Array[i].features,
                created_at: Array[i].created_at,
                updated_at: Array[i].updated_at,
                subscribedUsers: SubscriptionCount
            }
            UpdatedArray.push(ObjectData)

        }

        if (result.rows) {
            res.json({
                message: "All Products Fetched",
                error: false,
                result: UpdatedArray
            })
        }
        else {
            res.json({
                message: "could not fetch",
                error: true,
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            error: true,
        })
    }
    finally {
        client.release();
    }
}
exports.getAllProductsPagination = async (req, res) => {
    const client = await pool.connect();
    try {

        const {
            rowsPerPage,
            page
        } = req.body
        const offset = (page - 1) * rowsPerPage; // Calculate the offset based on page and rowsPerPage

        const query = `SELECT * FROM products LIMIT $1 OFFSET $2 `; // Use LIMIT and OFFSET for pagination
        const values = [rowsPerPage, offset];
        // get all products 
        const query1 = `SELECT * FROM products`;
        const result1 = await pool.query(query1);
        let totalRows = result1.rowCount;
        let totalPages = Math.ceil(totalRows / rowsPerPage);
        try {
            const result = await pool.query(query, values);
            // get subscribed users 
            let UpdatedArray = []
            let Array = result.rows
            for (let i = 0; i < Array.length; i++) {
                const ProductId = Array[i].product_id
                const query1 = 'SELECT * FROM subscriptions WHERE product_id=$1'
                const result1 = await pool.query(query1, [ProductId]);
                let SubscriptionCount = result1.rows.length
                let ObjectData = {
                    product_id: Array[i].product_id,
                    product_name: Array[i].product_name,
                    product_id_stripe: Array[i].product_id_stripe,
                    price: Array[i].price,
                    image: Array[i].image,
                    description: Array[i].description,
                    features: Array[i].features,
                    created_at: Array[i].created_at,
                    updated_at: Array[i].updated_at,
                    subscribedUsers: SubscriptionCount
                }
                UpdatedArray.push(ObjectData)

            }

            if (result.rows) {
                res.json({
                    message: "Products Fetched Successfully",
                    error: false,
                    result: UpdatedArray,
                    rowsPerPage: rowsPerPage,
                    page: page,
                    totalPages: totalPages
                });
            } else {
                res.json({
                    message: "No Products Found",
                    error: true
                });
            }
        } catch (error) {
            res.json({
                message: "Error fetching products",
                error: true,
                details: error.message
            });
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            error: true,
        })
    }
    finally {
        client.release();
    }

}
exports.getProductDetails = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            product_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM products WHERE product_id =$1 '
        const result = await pool.query(query, [product_id]);
        // get messages 
        const Data = result.rows[0]//product
        // console.log(Data)
        // get packages 
        const packagesQuery = 'SELECT * FROM packages WHERE product_id = $1';
        const packagesResult = await pool.query(packagesQuery, [product_id]);

        const packagesData = packagesResult.rows;
        // for (const package of packagesData) {
        //     const featuresQuery = 'SELECT * FROM features WHERE package_id = $1';
        //     const featuresResult = await pool.query(featuresQuery, [package.package_id]);

        //     package.features = featuresResult.rows;
        // }
        res.json({
            message: "All Products Fetched",
            error: false,
            data: {
                product: Data,
                packages: packagesData,
            },
        });

    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            error: true,
            data: err.message
        })
    }
    finally {
        client.release();
    }
}
exports.getProductDetailsByStripeId = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            product_id_stripe,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM products WHERE product_id_stripe =$1 '
        const result = await pool.query(query, [product_id_stripe]);
        // get messages 
        const Data = result.rows[0]//product
        // console.log(Data)
        // get packages 
        const packagesQuery = 'SELECT * FROM packages WHERE product_id = $1';
        const packagesResult = await pool.query(packagesQuery, [product_id_stripe]);

        const packagesData = packagesResult.rows;
        for (const package of packagesData) {
            const featuresQuery = 'SELECT * FROM features WHERE package_id = $1';
            const featuresResult = await pool.query(featuresQuery, [package.package_id]);

            package.features = featuresResult.rows;
        }
        res.json({
            message: "All Products Fetched",
            error: false,
            data: {
                product: Data,
                packages: packagesData,
            },
        });

    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            error: true,
            data: err.message
        })
    }
    finally {
        client.release();
    }
}

