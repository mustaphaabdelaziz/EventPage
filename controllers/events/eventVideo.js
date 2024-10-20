const Event = require("../../models/event");
const i18next = require("../../config/i18next");
module.exports.addVideo = async (req, res) => {
  const { id } = req.params;
  const { title, url } = req.body;
  let embedUrl;

  const youtubeMatch =
    url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)&shorts=1/) ||
    url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/) ||
    url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/) ||
    url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);

  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  // Check if the URL is from Facebook

  const facebookMatch =
  url.match(/facebook\.com\/[^/]+\/videos\/(\d+)/) ||
  url.match(/facebook\.com\/.*\/videos\/(\d+)/) ||
  url.match(/facebook\.com\/reel\/(\d+)/) ||
  url.match(/facebook\.com\/share\/v\/([a-zA-Z0-9]+)/) ||
  url.match(/facebook\.com\/watch\/\?v=([a-zA-Z0-9]+)/);

if (facebookMatch) {
  const videoId = facebookMatch[1];
  // embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=560&height=314`;
  embedUrl = `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/watch/?v=${videoId}&show_text=false&width=560&height=314`;
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
