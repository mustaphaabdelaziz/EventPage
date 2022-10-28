const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../../utils/catchAsync");
const {
  register,
  renderRegisterForm,
  deleteParticipant,
  updateParticpant,
} = require("../../controllers/participants/participants");
router
  .route("/register")
  .get(catchAsync(renderRegisterForm))
  .post(catchAsync(register));
router
  .route("/:id")
  .delete(catchAsync(deleteParticipant))
  .put(catchAsync(updateParticpant));
module.exports = router;
