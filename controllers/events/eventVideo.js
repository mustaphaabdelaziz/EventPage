const Event = require("../../models/event");
const i18next = require("../../config/i18next");
module.exports.addVideo = async (req, res) => {
  // res.send("good");
  const { id } = req.params;
  const { title, url } = req.body;
  const videoIdMatch = url.match(/v=([^&]+)/);
  const videoId = videoIdMatch[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  await Event.findByIdAndUpdate(id, {
    $push: {
      videos: {
        url:embedUrl,
        title,
      },
    },
  });
  req.flash("success", `${i18next.t("video_addition_message")}`);

  res.redirect(`/events/${id}`);
};
