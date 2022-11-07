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
   
  },
  opts
);

module.exports = mongoose.model("Article", Article);
//# sourceMappingURL=materiel.js.map
