const { pool } = require("../../config/db.config");

exports.createFeatures = async (req, res, next) => {

    const client = await pool.connect();
    try {
        const {
            package_id,
            description

        } = req.body;
        // const company_user = false;
        if (package_id === null || package_id === "" || package_id === undefined) {
            res.json({ error: true, message: "Please Provide Package Id " });

        } else {
            const userDataCheck = await pool.query("SELECT * FROM packages WHERE package_id=$1",
                [package_id]);

            if (userDataCheck.rows.length === 0) {
                res.json({ error: true, data:[], message: " No Package exist for this Id." });


            } else {
                const userData = await pool.query("INSERT INTO features(package_id,description) VALUES($1,$2) returning *",
                [
                    package_id,
                    description ||null
                ])
            const data = userData.rows[0]
            if (userData.rows.length === 0) {
                res.json({ error: true, data, message: "Can't Create Features" });


            } else {
                res.json({ error: false, data, message: "Features Created Successfully" });

            }

               

            }
        }




    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }

}
exports.updateFeatures = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            Features_id,
            image,
            Features_name,
            description

        } = req.body;
        // const company_user = false;
        if (Features_id === null || Features_id === "" || Features_id === undefined) {
            res.json({ error: true, message: "Please Provide Features Id" });

        } else {
            let query = 'UPDATE Featuress SET ';
            let index = 2;
            let values = [Features_id];

            if (image) {
                query += `image = $${index} , `;
                values.push(image)
                index++
            }
            if (Features_name) {
                query += `Features_name = $${index} , `;
                values.push(Features_name)
                index++
            } 
            if (description) {
                query += `description = $${index} , `;
                values.push(description)
                index++
            }
            query += 'WHERE Features_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)

            if (result.rows.length === 0) {
                res.json({ error: true, data: [], message: "Something went wrong" });

            } else {
                res.json({ error: false, data: result.rows, message: "Features Updated Successfully" });

            }

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteFeatures = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            Features_id,
        } = req.body;
        // const company_user = false;
        if (Features_id === null || Features_id === "" || Features_id === undefined) {
            res.json({ error: true, message: "Please Provide Features Id" });

        } else {
            const deleteUserQuery = await pool.query(
                "DELETE FROM Featuress WHERE Features_id = $1",
                [Features_id]
              );
          
              // Check if any rows were deleted
              if (deleteUserQuery.rowCount === 1) {
                res.json({ error: false, message: "Features Deleted Successfully" });
              } else {
                res.json({ error: true, message: "Cannot Delete Features" });
              }

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteAllFeatures = async (req, res) => {
    const client = await pool.connect();
    try {
            const deleteUserQuery = await pool.query(
                "DELETE FROM Featuress"
              );
          
              // Check if any rows were deleted
              if (deleteUserQuery.rowCount === 0) {
                res.json({ error: true, message: "Cannot Delete Features" });

              } else {
                res.json({ error: false, message: "All Features Deleted Successfully" });

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
exports.getUserByUniqId= async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            uniq_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM users WHERE uniq_id =$1 '
        const result = await pool.query(query, [uniq_id]);
        // get messages 
        // const Data= result.rows

        if (result.rows.length===0) { 
             res.json({
                message: "could not fetch",
                error: true,
            })
          
        }
        else {
            res.json({
                message: "All Users Fetched",
                status: true,
                result: result.rows[0]
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


