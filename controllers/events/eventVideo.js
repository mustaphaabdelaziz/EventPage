const Event = require("../../models/event");
module.exports.addVideo = async (req, res) => {

  // res.send("good");
  const { id } = req.params;
  const { title, url } = req.body;
  await Event.findByIdAndUpdate(id, {
    $push: {
      videos: {
        url,
        title,
      },
    },
  });
  req.flash("success", "Successfully deleted event");
  res.redirect(`/events/${id}`);
};
