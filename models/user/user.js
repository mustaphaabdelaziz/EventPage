const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const opts = {
  toJSON: {
    virtuals: true,
  },
};

const UserSchema = new Schema(
  {
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true, required: true },
    birthdate: { type: Date, default: Date.now },
    phone: { type: String, trim: true },
    gender: { type: String, trim: true },
    job: { type: String, trim: true },
    city: { type: String, trim: true },
    attendedEvents: [
      {
        _id: false,
        event: { type: Schema.Types.ObjectId, ref: "Event" },
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
      index: true, // Index for faster queries
    },
    privileges: [{ type: String, default: "user" }],
    hash: { type: String, required: true },
    salt: { type: String, required: true, default: "undefined" },
    loggedIn: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    resetToken: {
      token: String,
      createdAt: { type: Date, default: Date.now },
      expires: { type: Date, default: Date.now },
    },
    preferedLng: { type: String, trim: true },
  },
  opts
);

UserSchema.plugin(passportLocalMongoose);

UserSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("hash")) {
      const salt = await bcrypt.genSalt(10);
      this.salt = salt;
      this.hash = await bcrypt.hash(this.hash, salt);
    }
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.verifyPassword = function (password, hash) {
  return bcrypt.compareSync(password, hash);
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetToken.token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetToken.createdAt = Date.now();
  this.resetToken.expires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
// // ================ this is a Base Schema for all other users Type =================
// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const opts = {
//   toJSON: {
//     virtuals: true,
//   },
// };
// //  This strategy integrates Mongoose with the passport-local strategy.
// const passportLocalMongoose = require("passport-local-mongoose");
// const Schema = mongoose.Schema;
// const UserSchema = new Schema(
//   {
//     firstname: { type: String, trim: true },
//     lastname: { type: String, trim: true, required: true },
//     birthdate: {
//       type: Date,
//       default: Date.now,
//     },
//     phone: String,
//     gender: String,
//     job: { type: String, trim: true },
//     city: String,
//     attendedEvents: [
//       {
//         _id: false,
//         event: {
//           type: Schema.Types.ObjectId,
//           ref: "Event",
//         },
//         role: { type: String, default: "Participant" },
//         file: {
//           url: String,
//           filename: String,
//         },
//       },
//     ],
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       index: true, // Add this line to create an index
//     },
//     privileges: [
//       {
//         type: String,
//         default: "user",
//       },
//     ],
//     hash: {
//       type: String,
//       required: true,
//     },
//     salt: {
//       type: String,
//       required: true,
//       default: "undefined",
//     },
//     loggedIn: {
//       type: Date,
//       default: Date.now,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     resetToken: {
//       token: String,
//       createdAt: {
//         type: Date,
//         default: Date.now(),
//       },
//       expires: {
//         type: Date,
//         default: Date.now(),
//       },
//     },
//     preferedLng: String,
//   },
//   opts
// );
// UserSchema.plugin(passportLocalMongoose);
// // creating a virtual field named fullname and it's made of firstname and lastname
// // this virtual property is not stored in the mongo DB
// UserSchema.virtual("fullname").get(function () {
//   return this.firstname + " " + this.lastname;
// });
// //  Error Handling in Pre-save Hook
// UserSchema.pre("save", async function (next) {
//   try {
//     if (this.isModified('hash')) {
//       const salt = await bcrypt.genSalt(10);
//       this.salt = salt;
//       this.hash = await bcrypt.hash(this.hash, salt);
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });
// // Password Hashing
// UserSchema.pre("save", async function (next) {
//   if (this.isModified('hash')) { // Only hash the password if it has been modified (or is new)
//     const salt = await bcrypt.genSalt(20); // Specify the number of salt rounds
//     this.salt = salt;
//     this.hash = await bcrypt.hash(this.hash, salt);
//   }
//   next();
// });
// // Secure Token Handling
// UserSchema.methods.createPasswordResetToken = function() {
//   const resetToken = crypto.randomBytes(32).toString('hex');
//   this.resetToken.token = crypto.createHash('sha256').update(resetToken).digest('hex');
//   this.resetToken.createdAt = Date.now();
//   this.resetToken.expires = Date.now() + 60 * 60 * 1000; // Token expires in 10 minutes
//   return resetToken;
// };
// // comparer function
// UserSchema.methods.verifyPassword = function (password, hash) {
//   return bcrypt.compareSync(password, hash);
// };
// module.exports = mongoose.model("User", UserSchema);
