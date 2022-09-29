const Event = require("../../models/event");
const moment = require("moment");
const Country = require("../../models/country");
const { cloudinary } = require("../../cloudinary");
// ===============================================================================
module.exports.index = async (req, res) => {
  const events = await Event.find({}).sort({
    "period.start": -1,
  });
  res.render("events/index", {
    events,
    moment,
  });
};

// ===============================================================================
module.exports.showEvent = async (req, res) => {
  const eventId = req.params.id;
  let MyEvent;
  MyEvent = await Event.findById(eventId).populate([]);

  if (!MyEvent) {
    req.flash("error", "Cannot find that event !!!");
    return res.redirect("/events");
  }
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("events/show", { MyEvent, moment, states });
};
// ===============================================================================
module.exports.renderEventForm = async (req, res) => {
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("events/new", { moment, states });
};
// ===============================================================================
module.exports.createEvent = async (req, res, next) => {
  // the forwardGeocode function turns a single location name
  // and returns its geographic coordinates.
  const { event, period } = req.body;

  let start = moment(period.start).format("MMM/DD/YYYY");
  let end = moment(period.end).format("MMM/DD/YYYY");

  const p = {
    start,
    end,
  };

  const createdEvent = new Event({
    ...event,
  });

  createdEvent.period = {
    ...p,
  };
  createdEvent.picture = {
    url: req.file.path,
    filename: req.file.filename,
  };
  const nbrOfDays = Math.abs(
    moment(period.end).diff(moment(period.start), "days")
  );
  for (i = 1; i <= nbrOfDays + 1; i++)
    createdEvent.program.push({
      day: "day " + i,
      date: moment(moment(period.start).add(i, "days")),
    });

  await createdEvent.save();
  req.flash("success", "Successfully made a new events !!!");
  res.redirect(`/events/${createdEvent._id}`);
};
// ===============================================================================
module.exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { deleteImage } = req.body;

  let event = await Event.findByIdAndUpdate(id, {
    ...req.body.event,
  });
  if (req.file) {
    event.picture = {
      url: req.file.path,
      filename: req.file.filename,
    };
    await event.save();
  }
  if (deleteImage) {
    await cloudinary.uploader.destroy(deleteImage);
  }
  req.flash("success", "Successfully updated event!");
  res.redirect(`/events/${event._id}`);
};
// ===============================================================================
module.exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  await Event.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted event");
  res.redirect("/events");
};
