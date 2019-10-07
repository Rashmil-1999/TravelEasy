// app/routes.js
var tourModule = require("../models/tours");
var userModule = require("../models/user");
let middleware = require("../middleware/middleware");

module.exports = function(app, passport) {
  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get("/", async (req, res) => {
    let displayTours = await tourModule.getToursByIds([
      { t_id: "33" },
      { t_id: "35" },
      { t_id: "32" }
    ]);
    console.log(displayTours);
    res.render("landing", {
      tours: displayTours,
      user: req.user,
      nav_attributes: { active: "active" }
    });
  });
  // =====================================
  // ABOUT ===============================
  // =====================================
  // show the about page
  app.get("/about", (req, res) => {
    res.render("about", { user: req.user, nav_attributes: { active: "" } });
  });
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get("/login", middleware.isNotLoggedIn, function(req, res) {
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
  app.get("/profile", middleware.isLoggedIn, function(req, res) {
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
    if (middleware.hasNull(user)) res.redirect("/login");
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
};
