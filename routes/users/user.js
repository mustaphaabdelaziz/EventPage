const express = require("express");
const passport = require("passport");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../../utils/catchAsync");
const {
  register,
  renderRegisterForm,
  renderUserForm,
  login,
  logout,
  showProfile,
  updateUser,
  deleteUser,
  showResetPasswordForm,
  passwordReset,
  changePassword,
  showEmailSendingForm,
  sendEmail,
} = require("../../controllers/users/user");
const { isLoggedIn } = require("../../middleware/middleware");
router
  .route("/register")
  .get(catchAsync(renderRegisterForm))
  .post((register));
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
  .route("/reset-password/")
  .get(catchAsync(showEmailSendingForm))
  .post(catchAsync(sendEmail));
router
  .route("/:id")
  .get(catchAsync(renderUserForm))
  .put(isLoggedIn, catchAsync(updateUser))
  .delete(isLoggedIn, catchAsync(deleteUser));
router.route("/:id/reset-password/").put(catchAsync(changePassword));
router
  .route("/reset-password/:token")
  .get(catchAsync(showResetPasswordForm))
  .post(catchAsync(passwordReset));
router.route("/:id/profile").get(catchAsync(showProfile));

module.exports = router;
