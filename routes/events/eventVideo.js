const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn, isAdmin } = require("../../middleware/middleware");
const { addVideo } = require("../../controllers/events/eventVideo");
router.route("/").post(isLoggedIn, isAdmin, catchAsync(addVideo));
module.exports = router;
