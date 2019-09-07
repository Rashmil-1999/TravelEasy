// app/routes.js
var tourModule = require("../app/models/tours");
var userModule = require("../app/models/user");

module.exports = function(app, passport) {
  //var http   = require('http');
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get("/", (req, res) => {
    let attributes = { home: "nav-item active", about: "nav-item" };
    res.render("landing", { user: req.user, attributes: attributes });
  });
  // =====================================
  // ABOUT ===============================
  // =====================================
  // show the about page
  app.get("/about", (req, res) => {
    let attributes = { home: "nav-item active", about: "nav-item" };
    res.render("about", { user: req.user, attributes: attributes });
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
    user.is_admin = 0;
    console.log(user);
    if (hasNull(user)) res.redirect("/login#registration?failed=true");
    else {
      userModule.createNewUser(user, function(err) {
        if (err) {
          res.redirect(500, "/internal_error");
          console.error(err);
        }
        res.redirect("/login");
      });
    }
  });
  // =====================================
  // CREATE TOUR =========================
  // =====================================
  // return the package search page where the search can
  app.post("/create-tour", isAdmin, async (req, res) => {
    await tourModule.createTour(req.body.tour, error => {
      if (err) {
        res.redirect(500, "/internal_error");
        console.error(err);
      }
    });
    res.redirect("/tours");
  });

  // =====================================
  // PACKAGE DETAIL ======================
  // =====================================
  //load the details of the clicked package
  app.get("/tours/:tour_id", async (req, res) => {
    let tour = await tourModule.getTour(req.params.tour_id);
    console.log(tour[0]);
    res.send("You selected package id: " + package_id + "\n" + tour[0]);
  });
  // =====================================
  // ALL TOURS ===========================
  // =====================================
  app.get("/tours", async (req, res) => {
    let tours = await tourModule.getAllTours();
    console.log("from handler: " + tours);
    res.send(tours[0].images[0]);
  });
};

// route middleware for checking if the current user is admin or not
const isAdmin = (req, res, next) => {
  // if user is admin then carry on
  if (req.user.is_admin === 1) return next();
  // if the aren't then redirect to customer-login
  else res.redirect("/login");
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
