let tourModule = require("../models/tours");
let middleware = require("../middleware/middleware");

module.exports = function(app) {
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
  app.post("/search", async (req, res) => {
    let search = req.body.search;
    let results = await tourModule.search(search);
    res.send(results);
  });

  // testing endpoint (remove it at the end)
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
