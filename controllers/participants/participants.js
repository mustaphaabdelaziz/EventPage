const Participant = require("../../models/participants/participant");
const Country = require("../../models/country");
const moment = require("moment");
const i18next = require("../../config/i18next");
module.exports.renderRegisterForm = async (req, res) => {
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("participants/register", { states, moment });
};
module.exports.register = async (req, res) => {
  const { user } = req.body;

  try {
    const participant = new Participant({
      ...user,
    });
    var str = participant.firstname;
    // make the name start with a capitalized letter
    participant.firstname = str.charAt(0).toUpperCase() + str.slice(1);
    str = participant.lastname;
    participant.lastname = str.charAt(0).toUpperCase() + str.slice(1);
    str = participant.job;
    participant.job = str.charAt(0).toUpperCase() + str.slice(1);
    participant.email = participant.email.toLowerCase();
    await participant.save();
    req.flash("success", "Vous avez insrit avec succès");
    res.redirect("/events");
  } catch (e) {
    req.flash("error", "Une erreur est survenue");
    res.redirect("register");
  }
};
