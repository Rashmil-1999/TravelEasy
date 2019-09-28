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
    res.send("You selected package id: " + req.params.tour_id + "\n" + tour[0]);
  });
  // =====================================
  // SEARCH ==============================
  // =====================================
  app.post("/search", async (req, res) => {
    let search = req.body.search;
    let results = await tourModule.search(search);
    console.log(results);
    res.render("results", {
      results: results,
      keyword: search,
      user: req.user
    });
  });

  app.get("/services", (req, res) => {
    res.render("services", { user: req.params.user });
  });

  app.get("/contact", (req, res) => {
    res.render("contact", { user: req.params.user });
  });

  app.get("/landing", (req, res) => {
    res.render("landing", { user: req.params.user });
  });

  // testing endpoint (remove it at the end)
  app.get("/test", async (req, res) => {
    res.render("contact");
  });
};
