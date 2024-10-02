const User = require("../../models/user/user");
const Event = require("../../models/event");
const Country = require("../../models/country");
const fonctions = require("../../seeds/fonction");
const privileges = require("../../seeds/privileges");
const moment = require("moment");
const i18next = require("../../config/i18next");
const { sendMail } = require("../../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
// ======================= userList ====================================================
module.exports.userList = async (req, res) => {
  const users = await User.find({});
  res.render("users/index", {
    users,
    fonctions: fonctions.fonction,
    privileges: privileges.privileges,
    moment,
  });
};
// ============================= renderRegisterForm ==============================================
module.exports.renderRegisterForm = async (req, res) => {
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("users/login", { states, moment });
};


// module.exports.register = async (req, res) => {
//   try {
//     // const { user, password } = req.body;
//     const {
//       firstname,
//       lastname,
//       phone,
//       email,
//       birthdate,
//       city,
//       gender,
//       job,
//       password,
//     } = req.body.user;
//     const userExist = await User.findOne({ email: email });
//     if (userExist) {
//       req.flash("error", "user already exist");
//       res.redirect("register");
//     } else {
//       const user = new User({
//         firstname:
//           firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
//         lastname:
//           lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
//         phone: phone,
//         email: email.toLowerCase(),
//         hash: password,
//         birthdate: moment(birthdate),
//         city: city,
//         gender: gender,
//         job: job,
//         privileges: ["user"],
//       });

//       await user.save().then((usr, err) => {
//         if (err) {
//           req.flash("error", err);
//           res.redirect("register");
//         } else {
//           req.login(usr, (err) => {
//             if (err) return next(err);
//             req.flash("success", "Bienvenu sur Oasis Event");
//             res.redirect("/events");
//           });
//         }
//       });
//     }
//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("register");
//   }
// };
// ======================== Register ===================================================
module.exports.register = [
  // Validation and sanitization
  body("user.firstname")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("First name is required"),
  body("user.lastname")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Last name is required"),
  body("user.phone")
    .trim()
    .escape()
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("user.email").trim().isEmail().withMessage("Invalid email address"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "error",
        errors
          .array()
          .map((err) => err.msg)
          .join(", ")
      );
      return res.redirect("register");
    }

    try {
      const {
        firstname,
        lastname,
        phone,
        email,
        birthdate,
        city,
        gender,
        job,
      } = req.body.user;
      const { password } = req.body;
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        req.flash("error", "User already exists");
        return res.redirect("register");
      }
      console.log("the email doesnn't exist");
      // const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstname:
          firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
        lastname:
          lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
        phone: phone,
        email: email.toLowerCase(),
        hash: password,
        birthdate: moment(birthdate),
        city: city,
        gender: gender,
        job: job,
        privileges: ["user"],
        preferedLng: "fr",
      });
      console.log("the user object created");
      await user.save();
      console.log("the user is saved");

      req.login(user, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Oasis Event");
        res.redirect("/events");
      });
    } catch (e) {
      next(e); // Use next() to pass errors to the error-handling middleware
    }
  },
];
// =============== Login ==============================
// module.exports.login = async (req, res, next) => {
module.exports.login = async (req, res) => {
  const preferedLng = req.user.preferedLng;
  i18next.changeLanguage(preferedLng).then((t) => {
    t("hello_message");
  });
  await User.findByIdAndUpdate(req.user.id, { loggedIn: moment() });
  req.flash("success", `${i18next.t("welcome_back")} ${req.user.fullname}`);
  const redirectUrl = req.session.returnTo || "/events";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
// try {
//   const preferedLng = req.user.preferedLng;
//   await i18next.changeLanguage(preferedLng);

//   await User.findByIdAndUpdate(req.user.id, { loggedIn: moment() });

//   req.flash("success", `${i18next.t("welcome_back")} ${req.user.fullname}`);

//   // Regenerate session ID to prevent session fixation
//   req.session.regenerate((err) => {
//     if (err) {
//       console.error(err);
//       req.flash("error", "An error occurred during login. Please try again.");
//       return res.redirect("/login");
//     } else {
//       const redirectUrl = req.session.returnTo || "/events";
//       delete req.session.returnTo;
//       res.redirect(redirectUrl);
//     }
//   });
// } catch (e) {
//   console.error(e);
//   req.flash("error", "An error occurred during login. Please try again.");
//   res.redirect("/login");
// }
// };
// ======================= Logout ==============
module.exports.logout = (req, res) => {
  // logout requere a callback function and a get request to work
  req.logout(() => {
    req.flash("success", `Goodbye`);
    res.redirect("login");
  });
};

module.exports.updateUser = async (req, res) => {
  const { user, picture } = req.body;
  //  const currentUser = req.user._id;
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      ...user,
    },
    { new: true }
  );
  res.redirect(`/user/${updatedUser._id}/profile`);
  // res.send(updatedUser);
};
module.exports.deleteUser = async (req, res) => {
  const { userid } = req.params;
  await User.findByIdAndDelete(userid);
  req.logout();
  req.flash("success", "Goodbey");
  res.redirect("/events");
};
module.exports.showProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  const events = await Event.find({ "author.id": req.params.id }).sort({
    "period.start": -1,
  });
  // const speakEvents = await Event.find({ speakers: { $in: [req.params.id] } })
  //   .sort({ "period.start": -1 })
  const speakEvents = await Event.find({}).sort({ "period.start": -1 });
  // res.send(speakEvents)
  res.render("users/profile", { user, events, speakEvents, moment });
};
module.exports.changePassword = async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  try {
    const user = await User.findById(req.user.id).select("+salt +hash");
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/user/" + req.user.id + "/profile");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.hash);
    if (!isMatch) {
      req.flash("error", "Old password is incorrect");
      return res.redirect("/user/" + req.user.id + "/profile");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user.hash = hash;
    user.salt = salt;
    await user.save();

    req.flash("success", "Password changed successfully");
    res.redirect("/user/" + req.user.id + "/profile");
  } catch (e) {
    console.error(e);
    req.flash("error", "An error occurred while changing the password");
    res.redirect("/user/" + req.user.id + "/profile");
  }
};

function generateResetToken() {
  return crypto.randomBytes(20).toString("hex");
}

module.exports.showEmailSendingForm = async (req, res) => {
  res.render("user/sendEmailReset");
};

module.exports.sendEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "No account with that email address exists");
      return res.redirect("back");
    }

    const resetToken = generateResetToken();
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const createdAt = Date.now();
    const expires = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 1 day

    user.resetToken = {
      token: hashedToken,
      createdAt: createdAt,
      expires: expires,
    };
    await user.save({ validateBeforeSave: false });

    // Send the reset token to the user's email
    sendMail(email, resetToken);

    req.flash("success", "Password reset link has been sent to your email");
    res.redirect("/user/login");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while sending the email");
    res.redirect("back");
  }
};
