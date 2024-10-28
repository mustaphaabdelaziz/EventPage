const mongoose = require("mongoose");

const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const Gallery = new Schema(
  {
    description: {
      type: String,
    },
    picture: {
      url: String,
      filename: String,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  opts
);
Gallery.virtual("thumbnail").get(function () {
  return this.picture.url.replace("/upload", "/upload/w_200");
});
module.exports = mongoose.model("Gallery", Gallery);
//# sourceMappingURL=materiel.js.map
