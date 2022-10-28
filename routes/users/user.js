const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const {
  register,
  renderRegisterForm,
  login,
  logout,
} = require("../../controllers/users/user");
const { isLoggedIn } = require("../../middleware/middleware");
router
  .route("/login")
  .get(renderRegisterForm)
  .post(
    passport.authenticate("user", {
      failureFlash: true,
      failureRedirect: "/user/login",
      failureMessage: true,
    }),
    login
  );
router.route("/logout").get(isLoggedIn, logout);
router
  .route("/register")
  .get(catchAsync(renderRegisterForm))
  .post(catchAsync(register));

module.exports = router;
