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
    folder: "CardioEvent/EventsPictures",
    allowedFormats: ["jpeg", "png", "jpg", "webp", "svg"],
  },
});
const ArticleStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "CardioEvent/ArticlePictures",
    allowedFormats: ["jpeg", "png", "jpg", "webp", "svg"],
  },
});

module.exports = {
  cloudinary,
  storage,
  ArticleStorage,
};
