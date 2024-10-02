const i18next = require("./i18next");
const User = require("../models/user/user");
module.exports.locals = (req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.bgColor = "bg-dark";
  res.locals.textColor = "text-dark";
  res.locals.currentLng = () => {
    // return req.cookies.lang;
    return i18next.language.toUpperCase();
  };
  res.locals.t = (key) => {
    return i18next.t(key);
  };
  res.locals.updateUserLng = async (lng, userType) => {
    res.cookie("lang", lng);
    if (userType === "user")
      req.user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { preferedLng: lng } },
        { new: true }
      );
  
  };
  next();
};
