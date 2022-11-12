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
    picture: {
      url: String,
      filename: String,
    },

    logo: String,
    location: String,
    period: {
      start: Date,
      end: Date,
    },
    author: String,
    speakers: [UserObject],
    program: [ProgramSchema],
    participants: [
      {
        role: String,
        participant: {
          type: Schema.Types.ObjectId,
          ref: "Participant",
        },
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
module.exports = mongoose.model("Event", EventSchema);
