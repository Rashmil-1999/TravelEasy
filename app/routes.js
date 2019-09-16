// app/routes.js
var tourModule = require("../app/models/tours");
var userModule = require("../app/models/user");
var utils = require("../utils");

module.exports = function(app, passport) {
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
    if (hasNull(user)) res.redirect("/login");
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
  // CREATE TOUR GET======================
  // =====================================
  app.get("/admin/create-tour", isLoggedIn, isAdmin, async (req, res) => {
    let tour_types = await tourModule.getAllTourTypes();
    let tour_places = await tourModule.getAllPlaces();
    res.render("create-tour", {
      tour_types: tour_types,
      tour_places: tour_places,
      placeExists: false
    });
  });
  // =====================================
  // CREATE TOUR POST=====================
  // =====================================
  // return the package search page where the search can
  app.post("/create-tour", isLoggedIn, isAdmin, async (req, res) => {
    // add files to the tour object
    // console.log("this");
    let tourData = {};
    let dates = req.body.dates.split(",");
    let places = req.body.places;

    tourData.tour = req.body.tour;
    tourData.tour.tt_id = parseInt(tourData.tour.tt_id, 10);
    tourData.dates = utils.getReversedDates(dates);
    tourData.places = utils.convertToInt(places);
    // console.log(tourData);
    await tourModule.createTour(tourData);
    res.redirect("/create-tour");
  });
  // =====================================
  // CREATE PLACE POST====================
  // =====================================
  app.post("/create-place", isLoggedIn, isAdmin, async (req, res) => {
    // add files to the tour object
    let i = 0;
    let image = req.files.image;
    let place = {};
    place.name = req.body.place_name;
    place.image_path = `/IMAGEUPLOADS/${image.name}`;
    let allPlaces = await tourModule.getAllPlaces();
    for (i = 0; i < allPlaces.length; i++) {
      if (place.name === allPlaces[i].name) {
        break;
      }
    }
    if (i === allPlaces.length) {
      image.mv(`C:/programming/WD/public/IMAGEUPLOADS/${image.name}`);
      await tourModule.createPlace(place);
    } else {
      let tour_types = await tourModule.getAllTourTypes();
      let tour_places = await tourModule.getAllPlaces();
      res.render("create-tour.ejs", {
        tour_types: tour_types,
        tour_places: tour_places,
        placeExists: true
      });
    }
    res.redirect("/create-tour");
  });
  // =====================================
  // CREATE TOUR TYPE=====================
  // =====================================
  app.post("/create-tour_type", isLoggedIn, isAdmin, async (req, res) => {
    await tourModule.createNewTourType(req.body.type);
    res.redirect("/create-tour");
  });
  // =====================================
  // ALL TOURS ===========================
  // =====================================
  app.get("/admin/tours", isLoggedIn, isAdmin, async (req, res) => {
    let tours = await tourModule.getAllTours();
    console.log("from handler: " + tours);
    res.send(tours);
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
  // SEARCH ==============================
  // =====================================
  app.post("/search", async (req, res) => {});

  app.get("/test", async (req, res) => {
    console.log(await tourModule.getAllPlaces());
    console.log(await tourModule.getAllTourTypes());

    const tourData = {
      tour: {
        name: "Goa",
        region: "goa",
        duration: "4N GOA",
        description:
          "4 Nights Goa: park regis/Adamo the bells/The acacia hotel/Citrus hotel/Whispering palms resort",
        itenary: "day1: day2: day3:",
        price: "2312423",
        tt_id: 2
      },
      places: [1],
      dates: ["2019-11-04", "2020-01-04", "2020-02-04"]
    };
    await tourModule.createTour(tourData);
    res.send("success");
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
//route middleware to make sure
function isNotLoggedIn(req, res, next) {
  // if user is not authenticated in the session, carry on
  if (!req.isAuthenticated()) return next();
  // if they are redirect them to the home page
  else res.redirect("/");
}
function hasNull(target) {
  for (var member in target) {
    if (target[member] === null || target[member] === "") return true;
  }
  return false;
}
