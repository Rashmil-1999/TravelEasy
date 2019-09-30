let tourModule = require("../models/tours");
let middleware = require("../middleware/middleware");
let utils = require("../../utils");
require("dotenv").config();
module.exports = function(app) {
  // =====================================
  // CREATE TOUR GET======================
  // =====================================
  app.get(
    "/admin/create-tour",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let tour_types = await tourModule.getAllTourTypes();
      let tour_places = await tourModule.getAllPlaces();
      res.render("create-tour", {
        tour_types: tour_types,
        tour_places: tour_places,
        placeExists: false
      });
    }
  );
  // =====================================
  // CREATE TOUR POST=====================
  // =====================================
  // return the package search page where the search can
  app.post(
    "/create-tour",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
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
      res.redirect("/admin/create-tour");
    }
  );
  // =====================================
  // CREATE PLACE POST====================
  // =====================================
  app.post(
    "/create-place",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
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
        console.log(
          `C:/Users/priyal/Desktop/wd_project/public/IMAGEUPLOADS/${image.name}`
        );
        image.mv(
          `C:/Users/priyal/Desktop/wd_project/public/IMAGEUPLOADS/${image.name}`
        );
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
      res.redirect("/admin/create-tour");
    }
  );
  // =====================================
  // CREATE TOUR TYPE=====================
  // =====================================
  app.post(
    "/create-tour_type",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      await tourModule.createNewTourType(req.body.type);
      res.redirect("/admin/create-tour");
    }
  );
  // =====================================
  // ALL TOURS ===========================
  // =====================================
  app.get(
    "/admin/tours",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let tours = await tourModule.getAllTours();
      console.log("from handler: " + tours);
      res.send(tours);
    }
  );
};
