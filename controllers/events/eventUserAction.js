const User = require("../../models/user/user");
const Event = require("../../models/event");

// =========================== subscribe ========================================================
module.exports.subscribe = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.params.userid;
  let event, user;
  //  if he's going to the event
  //subscribe = true means that the user is want to subscribe
  if (req.body.subscribe) {
    event = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { participants: { _id: req.user._id } } },
      { new: true }
    );

    user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { attendedEvents: { _id: eventId } } },
      { new: true }
    );
  } else {
    // if he's not going
    event = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { participants: { _id: req.user._id } } },
      { new: true }
    );
    user = await User.findByIdAndUpdate(
      userId,
      { $pull: { attendedEvents: { _id: eventId } } },
      { new: true }
    );
  }
  res.send({
    status: true,
    message: "user subscribed",
  });
};
