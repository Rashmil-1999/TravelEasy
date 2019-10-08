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

tour.getAllTourIds = async () => {
  const data = await database.raw(`
    SELECT t_id,name
    FROM tour;
  `);
  return data[0];
};

tour.getToursByIds = async ids => {
  let newids = [];
  newids.push(ids);
  const data = await getToursByGivenIds(newids);
  return data;
};

tour.getToursByRegion = async () => {
  let data_res = await database.raw(`
  SELECT DISTINCT region
  FROM tour
  `);

  let regions = data_res[0].map(region => region.region);
  console.log(regions);
  let dataList = [];
  for (var i = 0; i < regions.length; i++) {
    let tourResults = await database.raw(
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
    WHERE t.region = '${regions[i]}'`
    );
    let appendedData = await appendAdditionalData(tourResults[0]);
    dataList.push(appendedData);
  }
  // console.log(dataList);
  return dataList;
};

tour.getToursBydates = async dates => {
  if (dates.length === 2) {
    let query = `
      SELECT DISTINCT t_id
      FROM dates
      WHERE start_date BETWEEN '${dates[0]}' AND '${dates[1]}' 
    `;
    let data_res = await database.raw(query);
    data_res = await tour.getToursByIds(data_res[0]);
    return data_res;
  }
  let query = `
    SELECT t_id
    FROM dates
    WHERE start_date = '${dates[0]}'
  `;
  console.log(query);
  let data_res = await database.raw(query);
  console.log(data_res);
  data_res = await tour.getToursByIds(data_res[0]);
  return data_res;
};

tour.getFilePath = async t_id => {
  let dataRes = await database.raw(`
  SELECT file_path
  FROM itinerary
  WHERE t_id=${t_id};
  `);
  return dataRes[0][0];
};

tour.insertTourItinerary = async data => {
  let datares = await database.raw(`
    INSERT INTO itinerary (
      t_id,
      file_path
    )
    VALUES(
      ${data.t_id},
      "${data.file_path}"
    );
  `);
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
    JOIN tour t
      ON tp.t_id = t.t_id
    WHERE p.name LIKE '%${keyword}%' 
          OR
          t.name LIKE '%${keyword}%';
    `);
  let response = await getToursByGivenIds(searchResponse);
  return response;
};

tour.updateTourbyId = async (t_id, tourData) => {
  await deleteOldEntries(t_id);
  const { tour, places, dates } = tourData;
  const dataRes = await database.raw(`
    UPDATE tour 
    SET name="${tour.name}",
        region="${tour.region}",
        duration="${tour.duration}",
        description="${tour.description}",
        itenary="${tour.itenary}",
        price="${tour.price}",
        tt_id=${tour.tt_id}
    WHERE t_id=${t_id};
  `);

  for (let i = 0; i < places.length; i++) {
    await newTourPlaces(t_id, places[i]);
  }
  for (let i = 0; i < dates.length; i++) {
    await newDateEntry(t_id, dates[i]);
  }
};

tour.deleteTourbyId = async t_id => {
  let result = await database.raw(`
    DELETE 
    FROM tour 
    WHERE (t_id = '${t_id}');
  `);
};

const deleteOldEntries = async t_id => {
  let deleteDateQuery = `DELETE FROM dates WHERE (t_id = '${t_id}');`;
  let deleteTourPlacesQuery = `DELETE FROM tour_places WHERE (t_id = '${t_id}')`;

  await database.raw(deleteDateQuery);
  await database.raw(deleteTourPlacesQuery);
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
    // console.log(idArray[0][0]);
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
    console.log(finalQuery);
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
