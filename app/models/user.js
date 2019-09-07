// app/models/user.js
// load the things we need
//var bcrypt   = require('bcrypt-nodejs');
// define the schema for our user model
// var mysql = require("mysql");
var conn = require("./mysqlConn");
var passport = require("passport");

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
      // We will pass the error and the result to the function
      callback(err, result);
    }
  );
};

module.exports = user;
