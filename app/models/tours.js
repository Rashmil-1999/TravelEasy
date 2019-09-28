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

tour.getAllPlaces = async () => {
  const data = await database.raw(
    `SELECT 
        *
     FROM places
     ORDER BY name; 
  `
  );
  return data[0];
};

tour.getAllTourTypes = async () => {
  const data = await database.raw(`
    SELECT * FROM tour_type;
  `);
  return data[0];
};

// INSERT operations
tour.createTour = async tourData => {
  //create the tour here
  const { tour, places, dates } = tourData;
  const dataRes = await database.raw(`
    INSERT INTO tour (
      name,
      region,
      duration,
      description,
      itenary,
      price,
      tt_id
    )
    VALUES(
      "${tour.name}",
      "${tour.region}",
      "${tour.duration}",
      "${tour.description}",
      "${tour.itenary}",
      "${tour.price}",
      ${tour.tt_id}
    );
  `);
  const insertId = dataRes[0].insertId;
  console.log(insertId, places, dates);
  for (let i = 0; i < places.length; i++) {
    await newTourPlaces(insertId, places[i]);
    console.log("inserted place");
  }
  for (let i = 0; i < dates.length; i++) {
    await newDateEntry(insertId, dates[i]);
    console.log("inserted dates");
  }

  // console.log(dataRes);
};

//create new place
tour.createPlace = async place => {
  const insertResponse = await database.raw(`
   INSERT INTO places (
      name,
      image_path
   )
   VALUES(
      "${place.name}",
      "${place.image_path}"
   );
  `);
};
//create the new tour type
tour.createNewTourType = async tourType => {
  const insertResponse = await database.raw(`
    INSERT INTO tour_type (
        type
    )
    VALUES(
        "${tourType}"
    );
  `);
  return insertResponse[0].insertId;
};

tour.search = async keyword => {
  let searchResponse = await database.raw(`
    SELECT tp.t_id
    FROM places p
    JOIN tour_places tp
      ON p.pl_id = tp.pl_id
    WHERE p.name LIKE '${keyword}%';`);
  let response = await getToursByGivenIds(searchResponse);
  return response;
};

//create new date entry
const newDateEntry = async (t_id, date) => {
  let query = `INSERT INTO dates (t_id,start_date) VALUES(${t_id},"${date}");`;
  // console.log(query);
  const dataRes = await database.raw(query);
};

//create new tour_places entry
const newTourPlaces = async (t_id, place) => {
  let query = `INSERT INTO tour_places (t_id,pl_id) VALUES(${t_id},${place});`;
  // console.log(query);
  const dataRes = await database.raw(query);
};

//append additional info
const appendAdditionalData = async tours => {
  for (var i = 0; i < tours.length; i++) {
    let places = [...(await getPlacesById(tours[i].t_id))];
    let dates = await getDatesById(tours[i].t_id);

    tours[i].places = places;
    tours[i].dates = dates;
  }
  return tours;
};

// get a particular tour
const getTourById = async id => {
  const data = await database.raw(
    `SELECT 
      t.t_id,
      t.name,
      t.region,
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

// get all the tours
const getTours = async () => {
  const data = await database.raw(
    `SELECT 
      t.t_id,
      t.name,
      t.region,
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

// get all the tours by the id passed in the array
const getToursByGivenIds = async idArray => {
  if (idArray[0].length) {
    let queryCondition = `\nWHERE t.t_id = ${idArray[0][0].t_id}`;
    for (let i = 1; i < idArray[0].length; i++) {
      queryCondition += ` OR t.t_id = ${idArray[0][i].t_id}`;
    }
    queryCondition += `;`;
    let tourQuery = `SELECT 
      t.t_id,
      t.name,
      t.region,
      t.duration,
      t.description,
      t.itenary,
      t.price,
      tp.type
    FROM tour t
    JOIN tour_type tp
      ON t.tt_id = tp.tt_id`;
    let finalQuery = tourQuery + queryCondition;
    // console.log(finalQuery);
    let tours = await database.raw(finalQuery);
    tours = await appendAdditionalData(tours[0]);
    return tours;
  } else {
    return "No Results";
  }
};

// utility function to get the places by tour id
const getPlacesById = async id => {
  const data = await database.raw(
    `SELECT 
        pl.name,
        pl.image_path
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

module.exports = tour;
