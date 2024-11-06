require("dotenv").config();
const dotenv = require("dotenv");


let dbConfig = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  dbName: process.env.DBNAME,
};

module.exports = dbConfig;
