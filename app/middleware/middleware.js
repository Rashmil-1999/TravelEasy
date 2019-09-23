// route middleware for checking if the current user is admin or not
module.exports.isAdmin = (req, res, next) => {
  // if user is admin then carry on
  if (req.user.is_admin === 1) return next();
  // if the aren't then redirect to customer-login
  else res.redirect("/login");
};

// route middleware to make sure
module.exports.isLoggedIn = function(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();
  // if they aren't redirect them to the home page
  else res.redirect("/login");
};
//route middleware to make sure
module.exports.isNotLoggedIn = function(req, res, next) {
  // if user is not authenticated in the session, carry on
  if (!req.isAuthenticated()) return next();
  // if they are redirect them to the home page
  else res.redirect("/");
};
module.exports.hasNull = function(target) {
  for (var member in target) {
    if (target[member] === null || target[member] === "") return true;
  }
  return false;
};
