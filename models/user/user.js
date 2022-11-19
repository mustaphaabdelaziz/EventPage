// ================ this is a Base Schema for all other users Type =================
const mongoose = require("mongoose");
const opts = {
  toJSON: {
    virtuals: true,
  },
};
//  This strategy integrates Mongoose with the passport-local strategy.
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true, required: true },
    birthdate: String,
    phone: String,
    gender: String,
    job: { type: String, trim: true },
    city: String,
    attendedEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    privileges: [
      {
        type: String,
      },
    ],
  },
  opts
);
// creating a virtual field named fullname and it's made of firstname and lastname
// this virtual property is not stored in the mongo DB
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  passwordField: "password",
});
UserSchema.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});
module.exports = mongoose.model("User", UserSchema);
