const Event = require("../../models/event");
const i18next = require("../../config/i18next");
module.exports.addVideo = async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;
  let embedUrl;

  // Check if the URL is from YouTube
  const youtubeMatch = url.match(/v=([^&]+)/);
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  // Check if the URL is from Facebook

  const facebookMatch = url.match(/facebook\.com\/.*\/videos\/(\d+)/) || url.match(/facebook\.com\/reel\/(\d+)/);
  if (facebookMatch) {
    const videoId = facebookMatch[1];
    embedUrl = `https://www.facebook.com/video/embed?video_id=${videoId}`;
  }

  if (embedUrl) {
    await Event.findByIdAndUpdate(id, {
      $push: {
        videos: {
          url: embedUrl,
          title,
        },
      },
    });
    req.flash("success", `${i18next.t("video_addition_message")}`);
  } else {
    req.flash("error", `an error occurred while adding video`);
  }
  res.redirect(`/events/${id}`);
};
