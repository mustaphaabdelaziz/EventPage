const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "EventPlus/EventsPictures",
    allowedFormats: ["jpeg", "png", "jpg", "webp", "svg"],
  },
});
const profilePictures = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "EventPlus/Profile",
    allowedFormats: ["jpeg", "png", "jpg", "webp", "svg"],
  },
});
const companyPictures = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "EventPlus/Profile/Company",
    allowedFormats: ["jpeg", "png", "jpg", "webp", "svg"],
  },
});
const productPictures = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "EventPlus/Products",
    allowedFormats: ["jpeg", "png", "jpg", "webp", "svg"],
  },
});

module.exports = {
  cloudinary,
  storage,
  profilePictures,
  companyPictures,
  productPictures,
};
