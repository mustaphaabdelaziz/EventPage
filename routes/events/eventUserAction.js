const express = require("express");
const catchAsync = require("../../utils/catchAsync");
// this argument tells Express that the /:id/speaker should have access to parents
const router = express.Router({ mergeParams: true });

const { subscribe } = require("../../controllers/events/eventUserAction");
const { isLoggedIn } = require("../../middleware/middleware");

router.route("/").post(isLoggedIn, catchAsync(subscribe));

module.exports = router;
