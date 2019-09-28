let mysql = require("mysql");
require("dotenv").config();
var mysqlConn = mysql.createConnection({
  host: "localhost",
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: "tours"
});

module.exports = mysqlConn;
