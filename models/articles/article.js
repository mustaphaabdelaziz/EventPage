const mongoose = require("mongoose");

const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const Article = new Schema(
  {
    date: Date,
    title: {
      type: String,
      trim: true,
    },
    resume: {
      type: String,
      trim: true,
    },

    body: {
      type: String,
      trim: true,
    },
    picture: {
      url: String,
      filename: String,
    },
  },
  opts
);
Article.virtual("thumbnail").get(function () {
  return this.picture.url.replace("/upload", "/upload/w_200");
});
module.exports = mongoose.model("Article", Article);
//# sourceMappingURL=materiel.js.map
