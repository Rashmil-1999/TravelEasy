// app/models/tours.js
// load the dependencies
// defining our schema for the tour model
let mysql = require("mysql");

let tour = {
  // t_id:"",
  // name:"",
  // duration:"",
  // description:"",
  // itenary:"",
  // price:"",
  // tt_id:""
};

var connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Robinhoody1",
  database: "tours"
});

tour.getAllTours = () => {
  try {
    let allTours = [];
    let tours = connection.query(
      `SELECT * 
        FROM tours t
        JOIN tour_type tp
            ON t.tt_id = tp.tt_id`,
      (err, rows, fields) => {
        let result = [...rows];
        console.log(result);
        return result;
      }
    );
    tours.map(tour => {
      let places = getPlacesById(tour.t_id);
      let dates = getDatesById(tour.t_id);

      tour.places = [...places];
      tour.dates = [...dates];

      allTours.push(tour);
      return allTours;
    });
  } catch (err) {
    console.log("Authentication Error : " + err);
  }
};
// utility function to get the places by tour id
const getPlacesById = id => {
  return connection.query(
    `SELECT pl.name
            FROM tour_places tp
            JOIN places pl
                ON pl.pl_id = tp.pl_id
            WHERE tp.t_id = ${id}`,
    (err, rows, fields) => [...rows]
  );
};
// utility function to get the dates of tour by tour id
const getDatesById = id => {
  return connection.query(
    `SELECT date
            FROM dates dt
            WHERE t_id = ${id}`,
    (err, rows, fields) => [...rows]
  );
};
