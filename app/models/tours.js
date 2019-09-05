// app/models/tours.js
// load the dependencies
// defining our schema for the tour model
var conn = require("./mysqlConn");

let tour = {};

tour.getAllTours = () => {
  try {
    let allTours = [];
    let tours = conn.query(
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
      let images = getImagesById(tour.t_id);

      tour.images = [...images];
      tour.places = [...places];
      tour.dates = [...dates];

      allTours.push(tour);
    });
    return allTours;
  } catch (err) {
    console.log("Authentication Error : " + err);
  }
};
// utility function to get the places by tour id
const getPlacesById = id => {
  return conn.query(
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
  return conn.query(
    `SELECT date
            FROM dates dt
            WHERE t_id = ${id}`,
    (err, rows, fields) => [...rows]
  );
};

const getImagesById = id => {
  return conn.query(
    `SELECT pl.name i.image 
    FROM images i
    JOIN places pl
      ON pl.pl_id = i.pl_id
    WHERE i.t_id=${id}`,
    (err, rows, feilds) => [...rows]
  );
};

module.exports = tour;
