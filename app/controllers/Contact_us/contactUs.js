const { pool } = require("../../config/db.config");
exports.createContact = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { name, email,message } = req.body;

        if (!email) {
            return res.status(400).json({ error: true, message: "Please Provide Email" });
        }

            // Insert Log into the database
            const userData = await pool.query("INSERT INTO contact_us(name,email,message,status) VALUES($1,$2,$3,$4) returning *",
                [name || null, email,message,'pending']
            );


            res.status(200).json({
                error: false,
                data:userData.rows[0],
                message: "Message Sent Successfully",
            });
    } catch (err) {
        res.status(500).json({ error: true, data: [], message: "Catch error" });
    } finally {
        client.release();
    }
};
exports.updateContact = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            contact_id,
            status,

        } = req.body;
        // const Contact_user = false;
        if (contact_id === null || contact_id === "" || contact_id === undefined) {
            res.json({ error: true, message: "Please Provide contact Id" });

        } else {
            
            let query = 'UPDATE contact_us SET ';
            let index = 2;
            let values = [contact_id];

          
            if (status) {
                query += `status = $${index} , `;
                values.push(status)
                index++
            }
            query += 'WHERE contact_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)



            if (result.rows.length === 0) {
                res.json({ error: true, data: [], message: "Something went wrong" });

            } else {
                res.json({ error: false, data: result.rows, message: "Updated Status Successfully" });

            }

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
  

}

exports.deleteContact = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            featured_companies_id,
        } = req.body;
        // const Contact_user = false;
        if (featured_companies_id === null || featured_companies_id === "" || featured_companies_id === undefined) {
        
            res.json({ error: true, message: "Please Provide Contact Id" });

        } else {
           

            const deleteUserQuery = await pool.query(
                "DELETE FROM featured_companies WHERE featured_companies_id = $1",
                [featured_companies_id]
            );

            // Check if any rows were deleted
            if (deleteUserQuery.rowCount === 1) {
                res.json({ error: false, message: "Contact Deleted Successfully" });
            } else {
                res.json({ error: true, message: "Cannot Delete Contact" });
            }

        }

    }
    catch (err) {
        
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteAllContact = async (req, res) => {
    const client = await pool.connect();
    try {

        const deleteUserQuery = await pool.query(
            "DELETE FROM contact_us"
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Contact" });

        } else {
            res.json({ error: false, message: "All Contact Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}

exports.getAllContacts = async (req, res) => {
    const client = await pool.connect();
    try {
        
        const query = 'SELECT * FROM contact_us ORDER BY created_at DESC'
        const result = await pool.query(query);


        if (result.rows) {
            res.json({
                message: "All Contacts Fetched",
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

exports.getContactDetails = async (req, res) => {
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


