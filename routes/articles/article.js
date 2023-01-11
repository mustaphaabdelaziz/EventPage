const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../../cloudinary/index");
const upload = multer({ storage });
const {
  showArticles,
  addArticle,
  showArticle,

  removeArticle,
} = require("../../controllers/articles/article");
const { isLoggedIn, isAdmin } = require("../../middleware/middleware");
router;
router
  .route("/")
  .get(isLoggedIn, catchAsync(showArticles))
  .post(isLoggedIn, isAdmin, upload.single("picture"), catchAsync(addArticle));

router
  .route("/:idarticle")
  .delete(isLoggedIn, isAdmin, catchAsync(removeArticle))
  .get(catchAsync(showArticle));

module.exports = router;
