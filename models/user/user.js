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
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    privileges: [
      {
        type: String,
      },
    ],
    approved: {
      type: Boolean,
      default: false,
    },
  },
  opts
);
// creating a virtual field named fullname and it's made of firstname and lastname
// this virtual property is not stored in the mongo DB
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "username",
  passwordField: "password",
});
UserSchema.virtual("name").get(function () {
  return (
    this.username.charAt(0).toUpperCase() + this.username.slice(1).toLowerCase()
  );
});
module.exports = mongoose.model("User", UserSchema);
