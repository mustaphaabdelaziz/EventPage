const mongoose = require("mongoose");

const opts = {
  toJSON: {
    virtuals: true,
  },
};
const Schema = mongoose.Schema;
const Video = new Schema(
  {
   title: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
   
  },
  opts
);

module.exports = mongoose.model("Video", Video);
//# sourceMappingURL=materiel.js.map
