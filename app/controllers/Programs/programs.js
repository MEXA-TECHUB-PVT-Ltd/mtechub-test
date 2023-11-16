const { pool } = require("../../config/db.config");
exports.createProgram = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { title, description,image } = req.body;

        if (!title) {
            return res.status(400).json({ error: true, message: "Please Provide Title" });
        }

            // Insert Log into the database
            const userData = await pool.query("INSERT INTO programs(title,description,image) VALUES($1,$2,$3) returning *",
                [title, description,image]
            );


            res.status(200).json({
                error: false,
                data:userData.rows[0],
                message: "Program Created Successfully",
            });
    } catch (err) {
        res.status(500).json({ error: true, data: [], message: "Catch error" });
    } finally {
        client.release();
    }
};
exports.updateProgram = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            program_id,
            title, description,image 

        } = req.body;
        // const Program_user = false;
        if (program_id === null || program_id === "" || program_id === undefined) {
            res.json({ error: true, message: "Please Provide Program Id" });

        } else {
            
            let query = 'UPDATE programs SET ';
            let index = 2;
            let values = [program_id];

          
            if (title) {
                query += `title = $${index} , `;
                values.push(title)
                index++
            }
            if (description) {
                query += `description = $${index} , `;
                values.push(description)
                index++
            }
            if (image) {
                query += `image = $${index} , `;
                values.push(image)
                index++
            }
            query += 'WHERE program_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)



            if (result.rows.length === 0) {
                res.json({ error: true, data: [], message: "Something went wrong" });

            } else {
                res.json({ error: false, data: result.rows, message: "Updated Program Successfully" });

            }

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
  

}

exports.deleteProgram = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            program_id,
        } = req.body;
        // const Program_user = false;
        if (program_id === null || program_id === "" || program_id === undefined) {
        
            res.json({ error: true, message: "Please Provide Program Id" });

        } else {
           

            const deleteUserQuery = await pool.query(
                "DELETE FROM programs WHERE program_id = $1",
                [program_id]
            );

            // Check if any rows were deleted
            if (deleteUserQuery.rowCount === 1) {
                res.json({ error: false, message: "Program Deleted Successfully" });
            } else {
                res.json({ error: true, message: "Cannot Delete Program" });
            }

        }

    }
    catch (err) {
        
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteAllProgram = async (req, res) => {
    const client = await pool.connect();
    try {

        const deleteUserQuery = await pool.query(
            "DELETE FROM programs"
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Program" });

        } else {
            res.json({ error: false, message: "All Program Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}

exports.getAllPrograms = async (req, res) => {
    const client = await pool.connect();
    try {
        
        const query = 'SELECT * FROM programs ORDER BY created_at DESC'
        const result = await pool.query(query);


        if (result.rows) {
            res.json({
                message: "All Programs Fetched",
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
exports.getProgramById = async (req, res) => {
    const client = await pool.connect();
    try {
        const program_id = req.params.id;
        const query = 'SELECT * FROM programs WHERE program_id = $1'
        const result = await pool.query(query, [program_id]);
        if (result.rows.length === 0) {
            res.json({ error: true, data: [], message: "Something went wrong" });

        } else {
            
            res.json({ error: false, data: result.rows[0], message: "Get Program Successfully" });

        }

    }
catch (err) {
    res.json({ error: true, data: [], message: "Catch eror" });

} finally {
    client.release();
}
}




