// ================ this is a Base Schema for all other users Type =================
const mongoose = require("mongoose");
const opts = {
  toJSON: {
    virtuals: true,
  },
};
//  This strategy integrates Mongoose with the passport-local strategy.

const Schema = mongoose.Schema;
const ParticipantSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    birthday: String,
    email: {
      type: String,
      unique: true,
    },
    phone: String,
    gender: String,
    job: String,
    city: String,
    participantEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  opts
);
// creating a virtual field named fullname and it's made of firstname and lastname
// this virtual property is not stored in the mongo DB
ParticipantSchema.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});
ParticipantSchema.virtual("address").get(function () {
  return this.country + ", " + this.city;
});
ParticipantSchema.index({
  lastname: "text",
  firstname: "text",
});

module.exports = mongoose.model("Participant", ParticipantSchema);
