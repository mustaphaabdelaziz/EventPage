const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProgramSchema = require("./program");
const DiscussionSchema = require("./discussion");
const opts = { toJSON: { virtuals: true } };
const UserObject = {
  _id: Schema.Types.ObjectId,
  firstname: String,
  lastname: String,
  pictures: String,
};
const EventSchema = new Schema(
  {
    title: String,
    description: String,
    pictures: String,
    cover: String,
    logo: String,
    location: String,
    period: {
      start: Date,
      end: Date,
    },
    author: String,
    speakers: [UserObject],
    program: [ProgramSchema],
    discussions: [],
  },
  opts
);
EventSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a class="text-decoration-none" href="/events/${this._id}">${this.title}
  <img class ="mapPicture thumbnail" src="${this.pictures[0].url}"/></a><strong>`;
});
// MediaSchema.virtual("thumbnail").get(function () {
//   return this.url.replace("/upload", "/upload/w_200");
// });
module.exports = mongoose.model("Event", EventSchema);
