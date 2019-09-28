var knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "softy@123",
    database: "tours"
  }
});

module.exports = knex;
