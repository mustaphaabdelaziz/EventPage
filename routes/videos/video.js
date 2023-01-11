const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const {
  showVideos,
  addVideo,
  removeVideo,
  editVideo,
} = require("../../controllers/videos/video");
const { isLoggedIn } = require("../../middleware/middleware");
router;
router
  .route("/")
  .get(isLoggedIn, catchAsync(showVideos))
  .post(catchAsync(addVideo));

router.route("/:idvideo").put(isLoggedIn, catchAsync(editVideo));
router.route("/:idvideo").delete(isLoggedIn, catchAsync(removeVideo));

module.exports = router;
