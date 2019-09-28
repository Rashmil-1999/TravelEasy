let mysql = require("mysql");

var mysqlConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "softy@123",
  database: "tours"
});

module.exports = mysqlConn;
