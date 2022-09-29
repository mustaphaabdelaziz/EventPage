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
  },
  opts
);
// creating a virtual field named fullname and it's made of firstname and lastname
// this virtual property is not stored in the mongo DB
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "username",
  passwordField: "password",
});
module.exports = mongoose.model("User", UserSchema);
