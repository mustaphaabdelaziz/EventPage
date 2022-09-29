const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DiscussionSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: String,
  pictures: [String],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = DiscussionSchema;
