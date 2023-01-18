const Event = require("../../models/event");
const User = require("../../models/user/user");
const moment = require("moment");
module.exports.getProgram = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
};
module.exports.topicForm = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
};
module.exports.createTopic = async (req, res) => {
  const eventId = req.params.id;
  const { title, day, start, end } = req.body.program;
  const time = {
    start,
    end,
  };
  // find the event by eventId and the insert the new topic where day == day
  const event = await Event.findOneAndUpdate(
    { _id: eventId, "program.day": day },
    {
      $push: {
        "program.$.timeline": {
          title,
          time,
        },
      },
    },
    { new: true }
  );

  // res.send(event);
  res.redirect(`/events/${eventId}`);
};
module.exports.updateTopicForm = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
};
module.exports.updateTopic = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
};
module.exports.deleteTopic = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
};
