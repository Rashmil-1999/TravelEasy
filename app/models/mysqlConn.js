let mysql = require("mysql");

var mysqlConn = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Robinhoody1",
  database: "tours"
});

module.exports = mysqlConn;
