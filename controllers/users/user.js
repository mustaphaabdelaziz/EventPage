const User = require("../../models/user/user");
const Event = require("../../models/event");
const Country = require("../../models/country");
const moment = require("moment");
const i18next = require("../../config/i18next");
// ===========================================================================
module.exports.renderRegisterForm = async (req, res) => {
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("users/login", { states, moment });
};

// ===========================================================================
module.exports.register = async (req, res) => {
  try {
    const { user, password } = req.body;
    const { firstname, lastname, phone, email, birthdate, city, gender, job } =
      req.body.user;
    const newUser = new User({
      firstname:
        firstname.charAt(0).toUpperCase() + firstname.slice(1).toLowerCase(),
      lastname:
        lastname.charAt(0).toUpperCase() + lastname.slice(1).toLowerCase(),
      birthdate,
      gender,
      city,
      email: email.toLowerCase(),
      phone,
      job,
      privileges: ["user"],
    });
    // var str = newUser.firstname;
    // // make the name start with a capitalized letter
    // newUser.firstname = str.charAt(0).toUpperCase() + str.slice(1);
    // str = newUser.lastname;
    // newUser.lastname = str.charAt(0).toUpperCase() + str.slice(1);
    // str = newUser.job;
    // newUser.job = str.charAt(0).toUpperCase() + str.slice(1);
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to  Oasis Event");
      res.redirect("/events");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

// =============== Login ==============================
module.exports.login = (req, res) => {
  const preferedLng = req.user.preferedLng;
  i18next.changeLanguage(preferedLng).then((t) => {
    t("hello_message");
  }); 
  req.flash("success", `${i18next.t("welcome_back")} ${req.user.fullname}`);
  const redirectUrl = req.session.returnTo || "/events";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};
// ======================= Logout ==============
module.exports.logout = (req, res) => {
  // logout require a callback function and a get request to work
  req.logout(() => {
    req.flash("success", `Goodbye`);
    res.redirect("login");
  });
};

module.exports.updateUser = async (req, res) => {
  const { user,picture } = req.body;
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
