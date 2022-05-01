const mysql = require('mysql2');
require('dotenv').config();

module.exports = mysql.createPool({
  connectTimeout: 30,
  password: process.env.DB_PASSWORD,
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: '3306'
});
