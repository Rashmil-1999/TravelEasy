// server.js
// set up ======================================================================
// get all the tools we need
var express = require("express");
var app = express();
var passport = require("passport");
var flash = require("connect-flash");
var bodyParser = require("body-parser"); //to extract form data from the body
// var cookieParser = require("cookie-parser");
var session = require("express-session"); //to manage different sessions
var logger = require("morgan"); //for debugging and displaying on the console
var fileUpload = require("express-fileupload"); //to handle file uploads
var env = require("dotenv");
let nodeMailer = require("nodemailer");
// var utils = require("./utils");
env.config();
console.log(process.env.EMAILPASS);
//configure the Email transporter
let transporter = nodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "djsanghvinoreply@gmail.com",
    pass: process.env.EMAILPASS
  }
});

let mailOptions = {
  from: '"TravelEasy" <djsanghvinoreply@gmail.com>', // sender address
  to: "", // list of receivers
  subject: "", // Subject line
  text: "Here is the Itinerary you requested for.", // plain text body
  html:
    "<h1>Thankyou For Choosing TravelEazy</h1><b>Email Generated by the system</b>" // html body
};

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
require("./app/routes/loginRoutes")(app, passport); // load our routes and pass in our app and fully configured passport
require("./app/routes/createTourRoutes")(app);
require("./app/routes/tourRoutes")(app, transporter, mailOptions);
//privacy policy route /privacy_policy

//register route /register

//Itenary display route /package/:package/itenary

//bookings route /packages/:package/booking

//server port settings
app.listen(3000, () => {
  console.log("Project server started");
});
