const User = require("../../models/user/user");
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
    const { username, password } = req.body.user;

    const user = new User({
      username: username.toLowerCase(),
      privileges: ["user"],
    });
    const registeredUser = await User.register(user, password);
    req.flash("success", "Contact the admin to ativate your account");
    res.redirect("/user/login");
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
  const { user, socialMedia } = req.body;
  //  const currentUser = req.user._id;
  const newUser = new User({ ...user });
  newUser.socialMedia = { ...socialMedia };

  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user._id },
    {
      socialMedia: socialMedia,
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
