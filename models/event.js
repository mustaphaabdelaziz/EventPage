const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProgramSchema = require("./program");
const DiscussionSchema = require("./discussion");
const underscore = require("underscore");
const opts = { toJSON: { virtuals: true } };
const UserObject = {
  type: Schema.Types.ObjectId,
  ref: "User",
};
const EventSchema = new Schema(
  {
    title: String,
    description: String,
    picture: {
      url: String,
      filename: String,
    },

    videos: [
      {
        url: String,
        title: String,
      },
    ],
    gallery: [
      {
        url: String,
        filename: String,
      },
    ],
    logo: String,
    location: String,
    period: {
      start: Date,
      end: Date,
    },
    type: String,
    author: UserObject,
    speakers: [UserObject],
    program: [ProgramSchema],
    participants: [
      {
        _id: false,
        participant: UserObject,
        role: { type: String, default: "Participant" },
      },
    ],
  },
  opts
);
EventSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a class="text-decoration-none" href="/events/${this._id}">${this.title}
  <img class ="mapPicture thumbnail" src="${this.picture.url}"/></a><strong>`;
});
EventSchema.virtual("thumbnail").get(function () {
  return this.picture.url.replace("/upload", "/upload/w_200");
});
EventSchema.virtual("galleryThumbnail").get(function () {
  return this.gallery.url.replace("/upload", "/upload/w_200");
});
EventSchema.virtual("sortedProgram").get(function () {
  return underscore.sortBy(this.program.timeline, "time");
});
module.exports = mongoose.model("Event", EventSchema);
