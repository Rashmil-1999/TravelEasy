module.exports.getReversedDates = dates => {
  if (typeof dates !== "object") {
    let [day, month, year] = dates.split("-");
    return year.concat("-", month).concat("-", day);
  }
  return dates.map(date => {
    let [day, month, year] = date.split("-");
    return year.concat("-", month).concat("-", day);
  });
};

module.exports.convertToInt = values => {
  return values.map(value => parseInt(value, 10));
};

module.exports.convertToArray = inputString => {
  let convertedArr = inputString.trim().split("<:>");
  return convertedArr.map(value => {
    return value.trim();
  });
};

module.exports.getPlacesFromTourLists = tourData => {
  if (typeof tourData !== "object") {
    let { places } = tourData;
    let placeArray = [];
    for (var i = 0; i < places.length; i++) {
      placeArray.push(places[i].name);
    }
    return placeArray;
  }
  return tourData.map(tour => {
    let { places } = tour;
    let placeArray = [];
    for (var i = 0; i < places.length; i++) {
      placeArray.push(places[i].name);
    }
    return placeArray;
  });
};

module.exports.getDatesFromTourLists = tourData => {
  console.log(tourData);
  if (typeof tourData !== "object") {
    let { dates } = tourData;
    let datesArray = dates.map(date =>
      new Date(date.start_date).toDateString()
    );
    let dateArray = [];
    for (var i = 0; i < datesArray.length; i++) {
      dateArray.push(datesArray[i]);
    }
    return dateArray;
  }
  return tourData.map(tour => {
    let { dates } = tour;
    let datesArray = dates.map(date =>
      new Date(date.start_date).toDateString()
    );
    let dateArray = [];
    for (var i = 0; i < datesArray.length; i++) {
      dateArray.push(datesArray[i]);
    }
    return dateArray;
  });
};

module.exports.getPricesFromTourList = tourData => {
  return tourData.map(tour => {
    return this.convertToArray(tour.price);
  });
};

module.exports.getDescriptionFromTourList = tourData => {
  return tourData.map(tour => {
    return this.convertToArray(tour.description);
  });
};
