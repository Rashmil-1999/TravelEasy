var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//add database

//routes
app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/login", (req, res) => {
  res.render("login");
});
//server port settings
app.listen(3000, () => {
  console.log("Project server started");
});
