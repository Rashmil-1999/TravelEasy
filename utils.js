module.exports.getReversedDates = dates => {
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
