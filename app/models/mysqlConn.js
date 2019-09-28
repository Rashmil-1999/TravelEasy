let mysql = require("mysql");

var mysqlConn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Robinhoody1",
  database: "tours"
});

module.exports = mysqlConn;
