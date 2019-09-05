// app/routes.js
var tourModule = require("../app/models/tours");
var userModule = require("../app/models/user");

module.exports = function(app, passport) {
  //var http   = require('http');
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get("/", (req, res) => {
    res.render("landing", { user: req.user });
  });
  // =====================================
  // ABOUT ===============================
  // =====================================
  // show the about page
  app.get("/about", (req, res) => {
    res.render("about");
  });
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get("/login", isNotLoggedIn, function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render("login", {
      message: req.flash("loginMessage"),
      wrongPassword: false,
      wrongEmail: false
    });
  });
  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get("/profile", isLoggedIn, function(req, res) {
    res.render("profile", {
      user: req.user // get the user out of session and pass to template
    });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================

  app.get("/logout", function(req, res) {
    req.session.destroy(function(err) {
      res.redirect("/login"); //Inside a callback… bulletproof!
    });
  });

  // =====================================
  // REGISTER ============================
  // =====================================

  app.post("/register", function(req, res) {
    var user = req.body.user;
    console.log(user);
    if (hasNull(user)) res.redirect("/login#registration?failed=true");
    else {
      userModule.createNewUser(user, function(err) {
        if (err) {
          res.redirect(500, "/internal_error");
          console.error(err);
        }

        res.redirect("/");
      });
    }
  });

  // =====================================
  // PACKAGES ============================
  // =====================================
  // return the package search page where the search can
  app.get("/packages", (req, res) => {
    res.send("this  is package search page! Coming SOOOOON!");
  });

  // =====================================
  // PACKAGE DETAIL ======================
  // =====================================
  //load the details of the clicked package
  app.get("/packages/:package_id", (req, res) => {
    let package_id = req.params.package_id;
    res.send("You selected package id: " + package_id);
  });
  // =====================================
  // ALL TOURS ===========================
  // =====================================
  app.get("/tours", (req, res) => {
    let tours = tourModule.getAllTours();
    res.send(tours.toString());
  });
};

// route middleware to make sure
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();
  // if they aren't redirect them to the home page
  else res.redirect("/login");
}
function isNotLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (!req.isAuthenticated()) return next();
  // if they aren't redirect them to the home page
  else res.redirect("/");
}

function hasNull(target) {
  for (var member in target) {
    if (target[member] == null || target[member] == "") return true;
  }
  return false;
}
