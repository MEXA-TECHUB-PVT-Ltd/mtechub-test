const { pool } = require("../../config/db.config");
const { SECRET_KEY, PUBLISHABLE_KEY } = require('../../../app/stripe_keys');
const logStripeAction = require("../../maintainLog");
const stripe = require('stripe')(SECRET_KEY)
exports.createProduct = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const {  company_name } = req.body;

        if (!company_name) {
            return res.status(400).json({ error: true, message: "Please Provide Company Name" });
        }

            // Insert company into the database
            const userData = await pool.query("INSERT INTO company(company_name) VALUES($1) returning *",
                [company_name]
            );

            const data = userData.rows[0];

            res.status(200).json({
                error: false,
                data: data,
                message: "Company Created Successfully",
            });
        
    } catch (err) {
        res.status(500).json({ error: true, data: [], message: "Catch error" });
    } finally {
        client.release();
    }
};
exports.updateProduct = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            company_id,
            company_name,

        } = req.body;
        // const company_user = false;
        if (product_id === null || product_id === "" || product_id === undefined) {
            res.json({ error: true, message: "Please Provide Product Id" });

        } else {
            const product = await stripe.products.update(
                product_id,
                {
                    name: product_name,
                    description: description
                }
            );
            let request_data = [{
                product_id: product_id,
                name: product_name,
                description: description,
            }]
            let response_data = [{
                result: product,
            }]
            logStripeAction('Upate Product',
                request_data,
                response_data,
                'success'
            )
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
            res.json({ error: false, data: product, message: "Product Updated Successfully" });



            // if (result.rows.length === 0) {
            //     res.json({ error: true, data: [], message: "Something went wrong" });

            // } else {
            //     res.json({ error: false, data: result.rows, message: "Product Updated Successfully" });

            // }

        }

    }
    catch (err) {
        let request_data = [{
            product_id: req.body.product_id,
            name: req.body.product_name,
            description: req.body.description,
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
            res.json({ error: true, message: "Please Provide Product Id" });

        } else {
            const deleted = await stripe.products.del(
                product_id
            );
            let request_data = [{
                product_id: product_id,
            }]
            let response_data = [{
                result: deleted,
            }]
            logStripeAction('Delete Product',
                request_data,
                response_data,
                'success'
            )
            res.json({ error: false, data: deleted, message: "Product Deleted Successfully" });

            // const deleteUserQuery = await pool.query(
            //     "DELETE FROM products WHERE product_id = $1",
            //     [product_id]
            // );

            // // Check if any rows were deleted
            // if (deleteUserQuery.rowCount === 1) {
            //     res.json({ error: false, message: "Product Deleted Successfully" });
            // } else {
            //     res.json({ error: true, message: "Cannot Delete Product" });
            // }

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
        const products = await stripe.products.list();
        res.json({
            message: "All Products Fetched",
            error: false,
            result: products
        })
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
        res.json({
            message: "All Products Fetched",
            error: false,
            data: {
                product: Data,
                // packages: packagesData,
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

