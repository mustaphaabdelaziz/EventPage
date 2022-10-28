
// const { eventSchema, comentSchema } = require("../schemas.js");
// const ExpressError = require("../utils/ExpressError");
// ALL MIDDLEWARE GOES HERE

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/user/login");
  }
  next();
};

module.exports.errorPage = (err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (statusCode === 404 && !err.message) err.message = "Page Not Found";
  else if (statusCode === 403 && !err.message) err.message = "Forbiden";
  else if (statusCode === 500 && !err.message)
    err.message = "Internal Server Error";
  else if (!err.message) err.message = "Somthing Went Wrong";
  res.status(statusCode).render("errorHandling/error", {
    err,
    statusCode,
  });
};
