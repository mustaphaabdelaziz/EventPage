const express = require("express");
const catchAsync = require("../../utils/catchAsync");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudinary/index");
const upload = multer({ storage });
const {
  index,
  showEvent,
  renderEventForm,
  createEvent,
  updateEvent,
  deleteEvent,
  downloadFile,
} = require("../../controllers/events/events");
// const { isLoggedIn } = require("../../middleware/middleware");
router
  .route("/")
  .get(catchAsync(index))
  .post(upload.single("picture"), catchAsync(createEvent));
router.route("/new").get(catchAsync(renderEventForm));
router
  .route("/:id")
  .get(catchAsync(showEvent))
  .put(upload.single("picture"), catchAsync(updateEvent))
  .delete(catchAsync(deleteEvent));
router.route("/:id/download").get(catchAsync(downloadFile));
module.exports = router;
