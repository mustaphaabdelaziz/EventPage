const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../../utils/catchAsync");

const {
  getProgram,
  topicForm,
  createTopic,
  updateTopicForm,
  updateTopic,
  deleteTopic,
} = require("../../controllers/events/program");
router.route("/").get(catchAsync(getProgram)).post(catchAsync(createTopic));
router.route("/new").get(catchAsync(topicForm));
router
  .route("/:programId")
  .put( catchAsync(updateTopic))
  .delete(catchAsync(deleteTopic));
router.route("/:programId/edit").get(catchAsync(updateTopicForm));
module.exports = router;
