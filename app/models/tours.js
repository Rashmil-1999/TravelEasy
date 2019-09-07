// app/models/tours.js
// load the dependencies
// defining our schema for the tour model
// var conn = require("./mysqlConn");
var database = require("./knexClient");

let tour = {};

tour.getAllTours = async () => {
  try {
    let tours = await getTours();
    tours = await appendAdditionalData(tours);
    return tours;
  } catch (err) {
    console.log("Error : " + err);
  }
};

tour.getTour = async id => {
  try {
    let tour = await getTourById(id);
    tour = await appendAdditionalData(tour);
    // console.log(tour);
    return tour;
  } catch (err) {
    console.log("Error: " + err);
  }
};

tour.createTour = async (tour, handleError) => {
  //create the tour here

  handleError(error);
};

const appendAdditionalData = async tours => {
  for (var i = 0; i < tours.length; i++) {
    let places = [...(await getPlacesById(tours[i].t_id))];
    let dates = await getDatesById(tours[i].t_id);
    let images = await getImagesById(tours[i].t_id);

    tours[i].places = places;
    tours[i].dates = dates;
    tours[i].images = images;
  }
  return tours;
};

const getTourById = async id => {
  const data = await database.raw(
    `SELECT 
      t.t_id,
      t.name,
      t.duration,
      t.description,
      t.itenary,
      t.price,
      tp.type
    FROM tour t
    JOIN tour_type tp
        ON t.tt_id = tp.tt_id
    WHERE t.t_id = ${id}`
  );

  return data[0];
};

const getTours = async () => {
  const data = await database.raw(
    `SELECT 
      t.t_id,
      t.name,
      t.duration,
      t.description,
      t.itenary,
      t.price,
      tp.type
    FROM tour t
    JOIN tour_type tp
        ON t.tt_id = tp.tt_id`
  );
  return data[0];
};

// utility function to get the places by tour id
const getPlacesById = async id => {
  const data = await database.raw(
    `SELECT pl.name
            FROM tour_places tp
            JOIN places pl
                ON pl.pl_id = tp.pl_id
            WHERE tp.t_id = ${id}`
  );
  return data[0];
};
// utility function to get the dates of tour by tour id
const getDatesById = async id => {
  const data = await database.raw(
    `SELECT start_date
            FROM dates dt
            WHERE dt.t_id = ${id}`
  );
  return data[0];
};

const getImagesById = async id => {
  const data = await database.raw(
    `SELECT pl.name, i.image 
    FROM images i
    JOIN places pl
      ON pl.pl_id = i.pl_id
    WHERE i.t_id=${id}`
  );
  return data[0];
};

module.exports = tour;
