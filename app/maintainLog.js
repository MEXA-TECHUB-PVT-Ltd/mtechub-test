const { pool } = require("./config/db.config");

const logStripeAction = async (action, requestData, responseData, errorMessage) => {
    const timestamp = new Date();
    
    try {
        // Insert log data into the PostgreSQL database
        const query = `
            INSERT INTO stripe_logs (timestamp, action, request_data, response_data, error_message)
            VALUES ($1, $2, $3, $4, $5)
        `;
        await pool.query(query, [timestamp, action, requestData, responseData, errorMessage]);
    } catch (error) {
        console.error("Error logging Stripe action:", error);
    }
};
module.exports = logStripeAction;
