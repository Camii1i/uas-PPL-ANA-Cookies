const mysql = require("mysql2/promise");
require("dotenv").config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "",
  database: process.env.DB_NAME || "sweetcrumbs_db",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Function to test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection to SweetCrumbs MySQL successful.");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

module.exports = {
  pool,
  testConnection
};
