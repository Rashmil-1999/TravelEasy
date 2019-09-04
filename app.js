// server.js
// set up ======================================================================
// get all the tools we need
var express = require("express");
var app = express();
var passport = require("passport");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
// var cookieParser = require("cookie-parser");
var session = require("express-session");
// var logger = require("logger").createLogger();;
// var utils = require("./utils");

require("./config/passport")(passport); // pass passport for configuration

//add database
// var knex = require("knex")({
//   client: "mysql",
//   connection: {
//     host: "127.0.0.1",
//     user: "root",
//     password: "Robinhoody1",
//     database: "tours"
//   }
// });

// app.configure(function() {
// set up our express application
// app.use(logger("dev")); // log every request to the console
// app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({ extended: true })); // get information from html forms

app.set("view engine", "ejs"); // set up ejs for templating
app.use(express.static("public"));
// required for passport
app.use(
  session({
    secret: "priyu",
    resave: false,
    saveUninitialized: true
    // cookie: { secure: true }
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// });

//routes

// routes ======================================================================
require("./app/routes")(app, passport); // load our routes and pass in our app and fully configured passport

// app.post("/login", async (req, res) => {
//   let email = req.body.email;
//   let password = req.body.password;
//   let data_res = await utils.getPassword(knex, email);
//   // console.log(data_res);
//   // console.log(test);
//   if (data_res) {
//     if (data_res.password === password) {
//       res.redirect(`/${data_res.fname}`);
//     } else {
//       res.render("login", { wrongPassword: true, wrongEmail: false });
//     }
//   } else {
//     res.render("login", { wrongPassword: false, wrongEmail: true });
//   }
// });

//packages search post route  /packages

//package detail /packages/:package

//privacy policy route /privacy_policy

//register route /register

//Itenary display route /package/:package/itenary

//bookings route /packages/:package/booking

//server port settings
app.listen(3000, () => {
  console.log("Project server started");
});
