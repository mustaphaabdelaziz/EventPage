const mongoose = require("mongoose");

const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const HomeSchema = new Schema(
  {
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
  },
  opts
);

module.exports = mongoose.model("Home", HomeSchema);
//# sourceMappingURL=materiel.js.map
