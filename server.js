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
var logger = require("morgan");
var fileUpload = require("express-fileupload");
// var utils = require("./utils");

require("./config/passport")(passport); // pass passport for configuration

// set up our express application
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
  })
);
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true })); // get information from html forms
app.set("view engine", "ejs"); // set up ejs for templating
app.use(express.static("public"));
// required for passport
app.use(
  session({
    secret: "priyu",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
    // cookie: { secure: true }
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require("./app/routes")(app, passport); // load our routes and pass in our app and fully configured passport

//privacy policy route /privacy_policy

//register route /register

//Itenary display route /package/:package/itenary

//bookings route /packages/:package/booking

//server port settings
app.listen(3000, () => {
  console.log("Project server started");
});
