let tourModule = require("../models/tours");
let middleware = require("../middleware/middleware");
let utils = require("../../utils");

module.exports = function(app, transporter, mailOptions) {
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
    console.log(tour[0].t_id);
    let file_path = await tourModule.getFilePath(tour[0].t_id);
    /*console.log(file_path.file_path);*/

    res.render("itinerary", {
      tour: tour[0],
      itinerary: itinerary,
      description: description,
      places: places,
      dates: dates,
      items: items,
      costs: costs,
      file_path: file_path,
      user: req.user
    });
  });

  app.get(
    "/send-mail/:tourId/:tour",
    middleware.isLoggedIn,
    async (req, res) => {
      mailOptions.to = `${req.user.email_id}`;
      mailOptions.subject = `Itinerary for ${req.params.tour}`;
      let filepath = await tourModule.getFilePath(req.params.tourId);
      if (filepath) {
        mailOptions.attachments = [
          {
            path: process.env.PATHdir + `${filepath.file_path}`
          }
        ];
      } else {
        res.send("Itinerary coming soon! We are sorry for your inconvinence.");
      }
      console.log(process.env.EMAILPASS);
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message %s sent: %s", info.messageId, info.response);
      });

      res.redirect(`/tours/${req.params.tourId}`);
    }
  );

  // =====================================
  // SEARCH ==============================
  // =====================================
  app.post("/search", async (req, res) => {
    let search = req.body.search;
    let results = await tourModule.search(search);
    let dateArrayData = utils.getDatesFromTourLists(results);
    let descriptionArrayData = utils.getDescriptionFromTourList(results);
    // let date = new Date(results[0].dates[0].start_date);
    // console.log(date.toDateString());
    res.render("results", {
      results: results,
      user: req.user,
      datesArray: dateArrayData,
      descriptionArray: descriptionArrayData
    });
  });

  app.post("/filter-by-dates", async (req, res) => {
    let dateField1 = req.body.datefield1;
    let dateField2 = req.body.datefield2;
    // console.log(dateField1, dateField2);
    let DateArray = [];
    let descriptionArrayData = [];
    let dateArrayData = [];
    if (dateField1 === dateField2) {
      DateArray.push(dateField1);
    } else {
      DateArray.push(dateField1);
      DateArray.push(dateField2);
    }
    console.log(DateArray);
    let result_tours = await tourModule.getToursBydates(DateArray);
    if (result_tours !== "No Results") {
      dateArrayData = utils.getDatesFromTourLists(result_tours);
      descriptionArrayData = utils.getDescriptionFromTourList(result_tours);
    }
    console.log(result_tours);
    res.render("results", {
      results: result_tours,
      user: req.user,
      datesArray: dateArrayData,
      descriptionArray: descriptionArrayData
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
