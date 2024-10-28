const { date } = require("joi");
const Gallery = require("../../models/gallery/gallery");
const Event = require("../../models/event");
const moment = require("moment");
const { cloudinary } = require("../../cloudinary/index");

module.exports.gallery = async (req, res) => {
  const gallery = await Gallery.find({}).sort({ date: -1 });
  const events = await Event.find({});
  // db.foo.find().sort({_id:1}).limit(50);
  // send it to the client
  res.render("gallery/index", { gallery, moment, events });
};
module.exports.addPicture = async (req, res) => {
  // get the materiel id from the materiels table
  const { description, event } = req.body.gallery;

  const gallery = new Gallery({
    description,
    event,
  });
  gallery.picture = {
    url: req.file.path,
    filename: req.file.filename,
  };
  await gallery.save();
  req.flash("success", "Article a été ajouté avec succès");
  res.redirect("/gallery");
};
module.exports.updatePicture = async (req, res) => {
  const { id } = req.params;
  const { deleteImage } = req.body;
  const { description, event } = req.body.picture;

  let myPicture;

  let picture = {};
  let hasChanged = false;
  if (req.file) {
    hasChanged = true;
    picture = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  if (deleteImage) {
    try {
      await cloudinary.uploader.destroy(deleteImage);
    } catch (error) {
      console.error(`Failed to delete image ${deleteImage}:`, error);
    }
  }
  if (hasChanged) {
    myPicture = await Gallery.findByIdAndUpdate(id, {
      date: moment(date),
      description,
      event,
      picture,
    });
  } else {
    myPicture = await Gallery.findByIdAndUpdate(id, {
      date: moment(date),
      description,
      event,
    });
  }

  req.flash("success", "Successfully updated event!");
  res.redirect(`/gallery`);
};
module.exports.removePicture = async (req, res) => {
  const { id } = req.params;
  const gallery = await Gallery.findById(id);
  try {
    let result = await cloudinary.uploader.destroy(gallery.picture.filename);
    console.log(`Deleted image ${gallery.picture.filename}:`, result);
  } catch (error) {
    console.error(`Failed to delete image ${gallery.picture.filename}:`, error);
  }
  await Gallery.findByIdAndDelete(id);
  // send it to the client
  res.redirect(`/gallery`);
};
