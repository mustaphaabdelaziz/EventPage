const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../../utils/catchAsync");
const multer = require("multer");
const { storage } = require("../../cloudinary/index");
const upload = multer({ storage });
const {
  participantList,
  ParticipantsManagement,
} = require("../../controllers/participants/participants");
router.route("/").get(catchAsync(participantList));
router
  .route("/:idp")
  .put(upload.single("file"), catchAsync(ParticipantsManagement))
  .delete(catchAsync(participantList));
module.exports = router;
