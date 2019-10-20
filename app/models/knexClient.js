require("dotenv").config();

var knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: "tours"
  }
});
console.log(process.env.USER,process.env.PATHdir)
module.exports = knex;
