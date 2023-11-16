const { pool } = require("../../config/db.config");
exports.createCompany = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { image, company_name } = req.body;

        if (!company_name) {
            return res.status(400).json({ error: true, message: "Please Provide Company Name" });
        }

            // Insert Log into the database
            const userData = await pool.query("INSERT INTO featured_companies(image,company_name) VALUES($1,$2) returning *",
                [image || null, company_name]
            );


            res.status(200).json({
                error: false,
                data:userData.rows[0],
                message: "Company Created Successfully",
            });
    } catch (err) {
        res.status(500).json({ error: true, data: [], message: "Catch error" });
    } finally {
        client.release();
    }
};
exports.updateCompany = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            featured_companies_id,
            image,
            company_name,

        } = req.body;
        // const company_user = false;
        if (featured_companies_id === null || featured_companies_id === "" || featured_companies_id === undefined) {
            res.json({ error: true, message: "Please Provide featured_companies Id" });

        } else {
            
            let query = 'UPDATE featured_companies SET ';
            let index = 2;
            let values = [featured_companies_id];

            if (image) {
                query += `image = $${index} , `;
                values.push(image)
                index++
            }
            if (company_name) {
                query += `company_name = $${index} , `;
                values.push(company_name)
                index++
            }
            query += 'WHERE featured_companies_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)



            if (result.rows.length === 0) {
                res.json({ error: true, data: [], message: "Something went wrong" });

            } else {
                res.json({ error: false, data: result.rows, message: "Company Updated Successfully" });

            }

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
  

}

exports.deleteCompany = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            featured_companies_id,
        } = req.body;
        // const company_user = false;
        if (featured_companies_id === null || featured_companies_id === "" || featured_companies_id === undefined) {
        
            res.json({ error: true, message: "Please Provide Company Id" });

        } else {
           

            const deleteUserQuery = await pool.query(
                "DELETE FROM featured_companies WHERE featured_companies_id = $1",
                [featured_companies_id]
            );

            // Check if any rows were deleted
            if (deleteUserQuery.rowCount === 1) {
                res.json({ error: false, message: "Company Deleted Successfully" });
            } else {
                res.json({ error: true, message: "Cannot Delete Company" });
            }

        }

    }
    catch (err) {
        
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteAllCompany = async (req, res) => {
    const client = await pool.connect();
    try {

        const deleteUserQuery = await pool.query(
            "DELETE FROM featured_companies"
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Company" });

        } else {
            res.json({ error: false, message: "All Company Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}

exports.getAllCompanys = async (req, res) => {
    const client = await pool.connect();
    try {
        
        const query = 'SELECT * FROM featured_companies'
        const result = await pool.query(query);


        if (result.rows) {
            res.json({
                message: "All Companies Fetched",
                error: false,
                result: result.rows
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

exports.getCompanyDetails = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            featured_companies_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM featured_companies WHERE featured_companies_id =$1 '
        const result = await pool.query(query, [featured_companies_id]);
        // get messages 
        const Data = result.rows[0]//Log
        res.json({
            message: "All Companies Fetched",
            error: false,
            data: Data,
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


