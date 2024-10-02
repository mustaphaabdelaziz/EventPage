// ================ this is a Base Schema for all other users Type =================
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
    birthdate: {
      type: Date,
      default: Date.now,
    },
    phone: { type: String, trim: true, required: true },
    gender: { type: String, trim: true,default:"Male" },
    job: { type: String, trim: true,  },
    city: { type: String, trim: true },
    attendedEvents: [
      {
        _id: false,
        event: {
          type: Schema.Types.ObjectId,
          ref: "Event",
        },
        role: { type: String, default: "Participant" },
        file: {
          url: String,
          filename: String,
        },
      },
    ],
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    privileges: [
      {
        type: String,
        default: "user",
      },
    ],
    hash: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
      default: "undefined",
    },
    loggedIn: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetToken: {
      token: String,
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      expires: {
        type: Date,
        default: Date.now(),
      },
    },
    preferedLng: String,
  },
  opts
);
UserSchema.plugin(passportLocalMongoose);
// creating a virtual field named fullname and it's made of firstname and lastname
// this virtual property is not stored in the mongo DB
UserSchema.virtual("fullname").get(function () {
  return this.firstname + " " + this.lastname;
});
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.salt = salt;
  this.hash = await bcrypt.hash(this.hash, salt);
  next();
});

// comparer function
UserSchema.methods.verifyPassword = function (password, hash) {
  return bcrypt.compareSync(password, hash);
};
module.exports = mongoose.model("User", UserSchema);
