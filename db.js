// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('railway.app') // Railway já usa SSL
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = pool;
