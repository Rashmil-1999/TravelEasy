// app/models/user.js
// load the things we need
//var bcrypt   = require('bcrypt-nodejs');
// define the schema for our user model
// var mysql = require("mysql");
var conn = require("./mysqlConn");
var passport = require("passport");
var database = require("./knexClient");

var user = {
  id: "",
  fname: "",
  lname: "",
  email_id: "",
  password: "",
  is_admin: ""
};

// checking if password is valid
user.validateUserNameAndPassword = function(email, password, done) {
  try {
    conn.query(
      'SELECT * FROM tours.users WHERE email_id="' +
        email +
        '"AND password="' +
        password +
        '"',
      function(err, rows, fields) {
        if (rows.length > 0) {
          user = rows[0];
          console.log(
            "User : " +
              user.email_id +
              ", " +
              user.password +
              ", " +
              user.fname +
              ", " +
              user.lname +
              ", " +
              user.id
          );
          //serialize the query result save whole data as session in req.user[] array
          passport.serializeUser(function(user, done) {
            done(null, user);
          });

          passport.deserializeUser(function(id, done) {
            done(null, user);
          });

          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    );
  } catch (err) {
    console.log("Authentication Error : " + err);
  }
};

// 1 - try / catch doesn't work with async codes, so you don't need to use
// 2 - You need to add a callback to be trigered when everything had run
user.createNewUser = function(user, callback) {
  conn.query(
    'INSERT INTO tours.users (email_id, fname, lname, password, is_admin) VALUES ("' +
      user.email_id +
      '", "' +
      user.fname +
      '", "' +
      user.lname +
      '", "' +
      user.password +
      '",' +
      user.is_admin +
      ")",
    function(err, result) {
      // console.log(result.insertId);
      // We will pass the error and the result to the function
      callback(err, result);
    }
  );
};

user.getAllUsers = async () => {
  let usersResult = await database.raw(`
    SELECT * 
    FROM users;
  `);
  return usersResult[0];
};

user.getUserbyId = async id => {
  let userResult = await database.raw(`
    SELECT *
    FROM users
    WHERE id=${id};
  `);
  return userResult[0];
};

user.createNewAdminUser = async user => {
  let userInsert = await database.raw(
    'INSERT INTO tours.users (email_id, fname, lname, password, is_admin) VALUES ("' +
      user.email_id +
      '", "' +
      user.fname +
      '", "' +
      user.lname +
      '", "' +
      user.password +
      '",' +
      user.is_admin +
      ")"
  );
};

user.deleteUserbyId = async id => {
  await database.raw(`
    DELETE 
    FROM users
    WHERE id=${id};
  `);
};

user.updateUserbyId = async (id, user) => {
  await database.raw(`
    UPDATE users
    SET email_id="${user.email_id}",
        fname="${user.fname}",
        lname="${user.lname}",
        password="${user.password}",
        is_admin=${user.is_admin}
    WHERE id=${id};
  `);
};

module.exports = user;
