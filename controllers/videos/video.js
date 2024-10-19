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
  const videoIdMatch = url.match(/v=([^&]+)/);
  const videoId = videoIdMatch[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
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


  await Video.findByIdAndUpdate(idvideo, {
    title,
    url,
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
