const { pool } = require("../../config/db.config");
exports.createVideo = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { 
            thumbnail,
            program_id,
            video_url,
            title,
            description } = req.body;

        if (!program_id) {
            return res.status(400).json({ error: true, message: "Please Provide program_id" });
        }

            // Insert Log into the database
            const userData = await pool.query("INSERT INTO product_videos(thumbnail,program_id,video_url,title,description) VALUES($1,$2,$3,$4,$5) returning *",
                [ thumbnail,
                    program_id,
                    video_url,
                    title,
                    description]
            );


            res.status(200).json({
                error: false,
                data:userData.rows[0],
                message: "Video Added Successfully",
            });
    } catch (err) {
        res.status(500).json({ error: true, data: [], message: "Catch error" });
    } finally {
        client.release();
    }
};
exports.updateVideo = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            product_videos_id,
            thumbnail,
            video_url,
            title,
            description

        } = req.body;
        // const Video_user = false;
        if (product_videos_id === null || product_videos_id === "" || product_videos_id === undefined) {
            res.json({ error: true, message: "Please Provide Video Id" });

        } else {
            
            let query = 'UPDATE product_videos SET ';
            let index = 2;
            let values = [product_videos_id];

          
            if (thumbnail) {
                query += `thumbnail = $${index} , `;
                values.push(thumbnail)
                index++
            }
            if (video_url) {
                query += `video_url = $${index} , `;
                values.push(video_url)
                index++
            }
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
            query += 'WHERE product_videos_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");


            const result = await pool.query(query, values)



            if (result.rows.length === 0) {
                res.json({ error: true, data: [], message: "Something went wrong" });

            } else {
                res.json({ error: false, data: result.rows, message: "Updated Video Successfully" });

            }

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
  

}

exports.deleteVideo = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            product_videos_id,
        } = req.body;
        // const Video_user = false;
        if (product_videos_id === null || product_videos_id === "" || product_videos_id === undefined) {
        
            res.json({ error: true, message: "Please Provide Video Id" });

        } else {
           

            const deleteUserQuery = await pool.query(
                "DELETE FROM product_videos WHERE product_videos_id = $1",
                [product_videos_id]
            );

            // Check if any rows were deleted
            if (deleteUserQuery.rowCount === 1) {
                res.json({ error: false, message: "Video Deleted Successfully" });
            } else {
                res.json({ error: true, message: "Cannot Delete Video" });
            }

        }

    }
    catch (err) {
        
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}
exports.deleteAllVideo = async (req, res) => {
    const client = await pool.connect();
    try {

        const deleteUserQuery = await pool.query(
            "DELETE FROM product_videos"
        );

        // Check if any rows were deleted
        if (deleteUserQuery.rowCount === 0) {
            res.json({ error: true, message: "Cannot Delete Video" });

        } else {
            res.json({ error: false, message: "All Video Deleted Successfully" });

        }

    }
    catch (err) {
        res.json({ error: true, data: [], message: "Catch eror" });

    } finally {
        client.release();
    }
}

exports.getAllVideos = async (req, res) => {
    const client = await pool.connect();
    try {
        
        const query = 'SELECT * FROM product_videos ORDER BY created_at DESC'
        const result = await pool.query(query);


        if (result.rows) {
            res.json({
                message: "All Videos Fetched",
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

exports.getVideoDetails = async (req, res) => {
    const client = await pool.connect();
    try {
        const {
            program_id,
        } = req.body;
        //    const type="admin"
        const query = 'SELECT * FROM product_videos WHERE program_id =$1 '
        const result = await pool.query(query, [program_id]);
        // get messages 
        const Data = result.rows//Log
        res.json({
            message: "All Program Videos Fetched",
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


