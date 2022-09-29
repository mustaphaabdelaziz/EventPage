const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const {
  register,
  renderRegisterForm,
} = require("../../controllers/participants/participants");
router
  .route("/register")
  .get(catchAsync(renderRegisterForm))
  .post(catchAsync(register));

module.exports = router;
