const Event = require("../../models/event");
const Country = require("../../models/country");
const moment = require("moment");
const User = require("../../models/user/user");
module.exports.participantList = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id).populate({
    path: "participants.participant",
  });
  const algeria = await Country.find({});
  const states = algeria[0].states;
  // res.send(event.participants);
  res.render("events/participants/index", { event, moment, states });
};
module.exports.ParticipantsManagement = async (req, res) => {
  const { id, idp } = req.params;
  const { role } = req.body.participant;
  const event = await Event.findOneAndUpdate(
    { id, "participants.participant": idp },
    {
      $set: { "participants.$.role": role },
    }
  );
  if (req.file) {
    console.log("file");
    await User.findOneAndUpdate(
      { _id: idp, "attendedEvents.event": id },
      {
        $set: {
          "attendedEvents.$.role": role,
          "attendedEvents.$.file": {
            url: req.file.path,
            filename: req.file.filename,
          },
        },
      },
      { new: true }
    );
  } else {
    await User.findOneAndUpdate(
      { _id: idp, "attendedEvents.event": id },
      {
        $set: {
          "attendedEvents.$.role": role,
        },
      },
      { new: true }
    );
  }

  res.redirect(`/events/${id}/participants`);
};
