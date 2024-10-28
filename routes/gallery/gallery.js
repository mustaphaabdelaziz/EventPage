const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../../cloudinary/index");
const upload = multer({ storage });
const {
  gallery,
  addPicture,
  updatePicture,
  removePicture,
} = require("../../controllers/gallery/gallery");
const { isLoggedIn, isAdmin } = require("../../middleware/middleware");
router;
router
  .route("/")
  .get(catchAsync(gallery))
  .post(isLoggedIn, isAdmin, upload.single("picture"), catchAsync(addPicture));

router
  .route("/:id")
  .put(isLoggedIn, isAdmin, upload.single("picture"), catchAsync(updatePicture))
  .delete(isLoggedIn, isAdmin, catchAsync(removePicture));

module.exports = router;
