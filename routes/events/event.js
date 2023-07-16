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
  gallery,
} = require("../../controllers/events/events");
const { isLoggedIn, isAdmin } = require("../../middleware/middleware");
router
  .route("/")
  .get(catchAsync(index))
  .post(isLoggedIn, isAdmin, upload.single("picture"), catchAsync(createEvent));
router.route("/new").get(catchAsync(renderEventForm));
router
  .route("/:id")
  .get(catchAsync(showEvent))
  .put(isLoggedIn, isAdmin, upload.single("picture"), catchAsync(updateEvent))
  .delete(isLoggedIn, isAdmin, catchAsync(deleteEvent));

router.route("/:id/download").get(isLoggedIn, catchAsync(downloadFile));
router
  .route("/:id/gallery")
  .put(isLoggedIn, upload.array("gallery"), catchAsync(gallery));
module.exports = router;
