const express = require("express");
const catchAsync = require("../../utils/catchAsync");
const router = express.Router();
const {
  index,
  showEvent,
  renderEventForm,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../../controllers/events/events");
// const { isLoggedIn } = require("../../middleware/middleware");
router.route("/").get(catchAsync(index)).post(catchAsync(createEvent));
router.route("/new").get(catchAsync(renderEventForm));
router
  .route("/:id")
  .get(catchAsync(showEvent))
  .put(catchAsync(updateEvent))
  .delete(catchAsync(deleteEvent));
module.exports = router;
