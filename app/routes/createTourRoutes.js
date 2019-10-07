let tourModule = require("../models/tours");
let middleware = require("../middleware/middleware");
let utils = require("../../utils");
let usersModule = require("../models/user");
require("dotenv").config();
module.exports = function(app) {
  // =====================================
  // ALL TOURS ===========================
  // =====================================
  app.get(
    "/admin",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let toursData = await tourModule.getAllTours();
      let tourCount = toursData.length;
      let usersData = await usersModule.getAllUsers();
      let usersCount = usersData.length;
      let tourTypes = await tourModule.getAllTourTypes();
      let tourTypesCount = tourTypes.length;
      let placeArrayData = utils.getPlacesFromTourLists(toursData);
      let dateArrayData = utils.getDatesFromTourLists(toursData);
      let pricesArrayData = utils.getPricesFromTourList(toursData);
      let descriptionArrayData = utils.getDescriptionFromTourList(toursData);
      // console.log(placeArrayData);
      // console.log(dateArrayData);
      // console.log(pricesArrayData[0][0]);
      // console.log(descriptionArrayData);
      res.render("admin", {
        user: req.user,
        toursData: toursData,
        tourCount: tourCount,
        placesArray: placeArrayData,
        datesArray: dateArrayData,
        pricesArray: pricesArrayData,
        descriptionArray: descriptionArrayData,
        usersData: usersData,
        usersCount: usersCount,
        tourTypes: tourTypes,
        tourTypesCount: tourTypesCount
      });

      // console.log(descriptionArrayData);
      // res.send(descriptionArrayData);
    }
  );

  app.post(
    "/admin/register",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let user = req.body.user;
      user.is_admin = 1;
      await usersModule.createNewAdminUser(user);
      res.redirect("/admin");
    }
  );

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
      let tourIds = await tourModule.getAllTourIds();
      res.render("create-tour", {
        user: req.user,
        tour_types: tour_types,
        tour_places: tour_places,
        tourIds: tourIds,
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
      tourData.tour.description = tourData.tour.description.replace(/'/g, "");
      tourData.tour.description = tourData.tour.description.replace(/"/g, "");

      tourData.tour.tt_id = parseInt(tourData.tour.tt_id, 10);
      tourData.dates = utils.getReversedDates(dates);
      tourData.places = utils.convertToInt(places);
      // console.log(tourData);
      await tourModule.createTour(tourData);
      res.redirect("/admin");
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
        console.log(`C:/programming/WD/public/IMAGEUPLOADS/${image.name}`);
        image.mv(process.env.PATHdir + `/IMAGEUPLOADS/${image.name}`);
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
  app.post(
    "/create-tour_itinerary",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let itineraryFile = req.files.itinerary;
      console.log(itineraryFile.name);
      let filePath = `/IMAGEUPLOADS/${itineraryFile.name}`;
      let tourid = req.body.id;
      let data = {};
      data.file_path = filePath;
      data.t_id = parseInt(tourid, 10);
      console.log(tourid, data.t_id);
      itineraryFile.mv(
        process.env.PATHdir + `/IMAGEUPLOADS/${itineraryFile.name}`
      );
      await tourModule.insertTourItinerary(data);
      res.redirect("/admin/create-tour");
    }
  );

  app.get(
    "/admin/tour/edit/:t_id",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let t_id = req.params.t_id;
      let tour = await tourModule.getTour(t_id);
      let tour_types = await tourModule.getAllTourTypes();
      let tour_places = await tourModule.getAllPlaces();
      res.render("edit-tour", {
        t_id: t_id,
        tour: tour[0],
        tour_types: tour_types,
        tour_places: tour_places,
        user: req.user
      });
    }
  );

  app.get(
    "/admin/user/edit/:id",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let id = req.params.id;
      let user = await usersModule.getUserbyId(id);
      console.log(user);
      res.render("edit-user", {
        id: id,
        userL: req.user,
        user: user[0]
      });
    }
  );

  app.post(
    "/edit-tour/:t_id",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let t_id = req.params.t_id;
      let tourData = {};
      let dates = req.body.dates.split(",");
      if (typeof req.body.places !== "object") {
        tourData.places = [];
        tourData.places[0] = req.body.places;
      } else {
        let places = req.body.places;
        tourData.places = utils.convertToInt(places);
      }
      tourData.tour = req.body.tour;
      tourData.tour.tt_id = parseInt(tourData.tour.tt_id, 10);
      tourData.dates = utils.getReversedDates(dates);
      await tourModule.updateTourbyId(t_id, tourData);
      res.redirect("/admin");
    }
  );

  app.post(
    "/edit-user/:id",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let id = req.params.id;
      let user = req.body.user;
      await usersModule.updateUserbyId(id, user);
      res.redirect("/admin");
    }
  );

  app.get(
    "/admin/tour/delete/:t_id",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let t_id = req.params.t_id;
      await tourModule.deleteTourbyId(t_id);
      res.redirect("/admin");
    }
  );

  app.get(
    "/admin/user/delete/:id",
    middleware.isLoggedIn,
    middleware.isAdmin,
    async (req, res) => {
      let id = req.params.id;
      await usersModule.deleteUserbyId(id);
      res.redirect("/admin");
    }
  );
};
