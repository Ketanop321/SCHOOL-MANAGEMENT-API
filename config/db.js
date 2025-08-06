require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  // For PostgreSQL on Render
  const { Pool } = require('pg');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  console.log('Using PostgreSQL database');
} else {
  // For local MySQL
  const mysql = require('mysql2/promise');
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  console.log('Using MySQL database');
}

// Test the database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to the database');
    client.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

testConnection();

module.exports = pool;
