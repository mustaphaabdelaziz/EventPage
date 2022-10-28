const Participant = require("../../models/participants/participant");
const Event = require("../../models/event");
const Country = require("../../models/country");
const moment = require("moment");
const i18next = require("../../config/i18next");
module.exports.renderRegisterForm = async (req, res) => {
  const { eventid } = req.params;
  console.log(eventid);
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("participants/register", { states, moment, eventid });
};
module.exports.register = async (req, res) => {
  const { user } = req.body;
  const { eventid } = req.params;
  console.log(eventid);
  // console.log(user);
  // res.send(eventid);
  try {
    const participant = new Participant({
      firstname: user.firstname,
      lastname: user.lastname,
      birthday: user.birthday,
      gender: user.gender,
      city: user.city,
      email: user.email,
      phone: user.phone,
      job: user.job,
    });
    var str = participant.firstname;
    // make the name start with a capitalized letter
    participant.firstname = str.charAt(0).toUpperCase() + str.slice(1);
    str = participant.lastname;
    participant.lastname = str.charAt(0).toUpperCase() + str.slice(1);
    str = participant.job;
    participant.job = str.charAt(0).toUpperCase() + str.slice(1);
    participant.email = participant.email.toLowerCase();
    console.log("Participant");
    participant.participantEvents.push(eventid);
    console.log("pushed");
    console.log(participant);
    const newParticipant = await participant.save();

    const event = await Event.findByIdAndUpdate(eventid, {
      $push: {
        participants: {
          role: user.role,
          participant: newParticipant._id,
        },
      },
    });
    console.log("update event");
    req.flash("success", "Vous avez insrit avec succès");
    res.redirect("/events");
  } catch (e) {
    req.flash("error", "Une erreur est survenue");
    res.redirect("register");
  }
};
module.exports.index = async (req, res) => {
  const { id } = req.params;
  const events = await Event.findById(id).populate({
    path: "participants",
  });
  res.send(events);
};
module.exports.updateParticipant = async (req, res) => {
  const { id } = req.params;
  const events = await Event.findById(id).populate({
    path: "participants",
  });
  res.send(events);
};
module.exports.deleteParticipant = async (req, res) => {
  const { id } = req.params;
  const events = await Event.findById(id).populate({
    path: "participants",
  });
  res.send(events);
};
