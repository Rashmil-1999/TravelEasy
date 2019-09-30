let tourModule = require("../models/tours");
let middleware = require("../middleware/middleware");
let utils = require("../../utils");

module.exports = function(app) {
  app.get("/tours", async (req, res) => {
    let toursByRegion = await tourModule.getToursByRegion();
    console.log(toursByRegion[1].length);
    res.render("tour-list", {
      user: req.user,
      toursByRegion: toursByRegion
    });
  });

  // =====================================
  // PACKAGE DETAIL ======================
  // =====================================
  //load the details of the clicked package
  app.get("/tours/:tour_id", async (req, res) => {
    let tour = await tourModule.getTour(req.params.tour_id);
    let items = ["a", "b", "c", "d", "e", "f"];
    let itinerary = utils.convertToArray(tour[0].itenary);
    let places = tour[0].places;
    let dates = tour[0].dates.map(date =>
      new Date(date.start_date).toDateString()
    );
    let costs = utils.convertToArray(tour[0].price);
    let description = utils.convertToArray(tour[0].description);
    // console.log(itinerary, places.length, dates);
    res.render("itinerary", {
      tour: tour[0],
      itinerary: itinerary,
      description: description,
      places: places,
      dates: dates,
      items: items,
      costs: costs,
      user: req.user
    });
  });
  // =====================================
  // SEARCH ==============================
  // =====================================
  app.post("/search", async (req, res) => {
    let search = req.body.search;
    let results = await tourModule.search(search);
    // let date = new Date(results[0].dates[0].start_date);
    // console.log(date.toDateString());
    res.render("results", {
      results: results,
      keyword: search,
      user: req.user,
      nav_attributes: { active: "" }
    });
  });

  app.get("/privacy-policy", (req, res) => {
    res.render("privacy_policy", {
      user: req.params.user,
      nav_attributes: { active: "" }
    });
  });

  app.get("/contact", (req, res) => {
    res.render("contact", {
      user: req.params.user,
      nav_attributes: { active: "" }
    });
  });

  // testing endpoint (remove it at the end)
  app.get("/test", async (req, res) => {
    res.send(await tourModule.getToursByRegion());
  });
};
