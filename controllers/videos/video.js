const Video = require("../../models/videos/video");

module.exports.showVideos = async (req, res) => {
  const videos = await Video.find({});
  // send it to the client
  res.render("video/index", { videos });
};
module.exports.addVideo = async (req, res) => {
  // get the materiel id from the materiels table
  const { title, url, description } = req.body.video;
  let ytUrl = url;
  console.log(ytUrl);
  // replace:
  ytUrl = ytUrl.replace("/watch?v=", "/embed/");
  console.log(ytUrl);
  const video = new Video({
    title,
    url: ytUrl,
    description,
  });
  await video.save();
  req.flash("success", "Vidéo a été ajouté avec succès");
  res.redirect("/videos");
};
module.exports.removeVideo = async (req, res) => {
  const { idvideo } = req.params;

  const video = await Video.findByIdAndDelete(idvideo);
  // send it to the client

  res.redirect(`/videos`);
};
