const Video = require("../../models/videos/video");

module.exports.showVideos = async (req, res) => {
  const videos = await Video.find({});
  // send it to the client
  res.render("video/index", { videos });
};
module.exports.addVideo = async (req, res) => {
  // const { youtubeUrl } = req.body;

  // if (!youtubeUrl) {
  //   return res.status(400).json({ error: 'YouTube URL is required' });
  // }

  // const videoIdMatch = youtubeUrl.match(/v=([^&]+)/);

  // if (!videoIdMatch) {
  //   return res.status(400).json({ error: 'Invalid YouTube URL' });
  // }

  // const videoId = videoIdMatch[1];
  // const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  // get the materiel id from the materiels table
  const { title, url, description, chosen } = req.body.video;
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
  const isChosen = chosen;
  // replace:
  const video = new Video({
    title,
    url: embedUrl,
    description,
    chosen: isChosen === "on" ? true : false,
  });
  await video.save();
  req.flash("success", "Vidéo a été ajouté avec succès");
  res.redirect("/videos");
};
module.exports.editVideo = async (req, res) => {
  const { title, url, description, chosen } = req.body.video;
  const { idvideo } = req.params;
  const isChosen = chosen;
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
  await Video.findByIdAndUpdate(idvideo, {
    title,
    url: embedUrl,
    description,
    chosen: isChosen === "on" ? true : false,
  });
  req.flash("success", "Vidéo a été ajouté avec succès");
  res.redirect("/videos");
};
module.exports.removeVideo = async (req, res) => {
  const { idvideo } = req.params;
  const video = await Video.findByIdAndDelete(idvideo);
  // send it to the client
  res.redirect(`/videos`);
};
