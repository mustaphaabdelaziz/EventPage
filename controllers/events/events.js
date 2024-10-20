const Event = require("../../models/event");
const moment = require("moment");
const Country = require("../../models/country");
const { resolve } = require("path");
const User = require("../../models/user/user");
const { populate } = require("../../models/event");
const { cloudinary } = require("../../cloudinary/index");
const i18next = require("../../config/i18next");
// ===============================================================================
module.exports.index = async (req, res) => {
  const algeria = await Country.find({});
  const states = algeria[0].states;
  const events = await Event.find({}).sort({
    "period.start": -1,
  });
  res.render("events/index", {
    events,
    moment,
    moment,
    states,
  });
};

// ===============================================================================
module.exports.showEvent = async (req, res) => {
  const eventId = req.params.id;
  let MyEvent;
  MyEvent = await Event.findById(eventId);

  if (!MyEvent) {
    req.flash("error", "Cannot find that event !!!");
    res.redirect("/events");
  }
  const algeria = await Country.find({});
  const states = algeria[0].states;
  moment.locale(i18next.language);
  // res.send(MyEvent);
  moment.locale("");
  const expires = moment(MyEvent.period.end).isBefore(moment());
  // if(moment(MyEvent.period.end,"DD/M/YYYY").isBefore(moment(),"DD/MM/YYYY"))
  res.render("events/show", { MyEvent, moment, states, expires });
};
// ===============================================================================
module.exports.renderEventForm = async (req, res) => {
  const algeria = await Country.find({});
  const states = algeria[0].states;
  res.render("events/new", { moment, states });
};
// ===============================================================================
module.exports.createEvent = async (req, res) => {
  // the forwardGeocode function turns a single location name
  // and returns its geographic coordinates.
  const { event, period } = req.body;

  let start = moment(period.start).format("MM/DD/YYYY");
  let end = moment(period.end).format("MM/DD/YYYY");

  const p = {
    start,
    end,
  };

  const createdEvent = new Event({
    ...event,
  });
  createdEvent.title =
    event.title.charAt(0).toUpperCase() + event.title.slice(1).toLowerCase();
  createdEvent.period = {
    ...p,
  };
  createdEvent.picture = {
    url: req.file.path,
    filename: req.file.filename,
  };
  createdEvent.author = req.user._id;
  createdEvent.participants.push({
    role: "Organiser",
    participant: req.user._id,
  });
  const nbrOfDays = Math.abs(
    moment(period.end).diff(moment(period.start), "days")
  );
  for (i = 1; i <= nbrOfDays + 1; i++)
    createdEvent.program.push({
      day: "day " + i,
      date: moment(moment(period.start).add(i - 1, "days")),
    });

  await createdEvent.save();
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        attendedEvents: {
          role: "Organizer",
          event: createdEvent._id,
        },
      },
    },
    { new: true }
  );
  req.flash("success", "Successfully made a new events !!!");
  res.redirect(`/events/${createdEvent._id}`);
};
// ===============================================================================
module.exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { deleteImage, period } = req.body;
  const { title, description, location, video } = req.body.event;
  let start = moment(period.start).format("MM/DD/YYYY");
  let end = moment(period.end).format("MM/DD/YYYY");
  const p = {
    start,
    end,
  };
  let MyEvent;

  let picture = {};
  let hasChanged = false;
  if (req.file) {
    hasChanged = true;
    picture = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  console.log(deleteImage)
  if (deleteImage) {
    try {
      await cloudinary.uploader.destroy(deleteImage);
    } catch (error) {
      console.error(`Failed to delete image ${deleteImage}:`, error);
    }
   
  }
  if (hasChanged) {
    MyEvent = await Event.findByIdAndUpdate(id, {
      title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
      description,
      location,
      period: p,
      picture,
    });
  } else {
    MyEvent = await Event.findByIdAndUpdate(id, {
      title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
      description,
      location,
      period: p,
    });
  }

  req.flash("success", "Successfully updated event!");
  res.redirect(`/events/${id}`);
};
// ===============================================================================
module.exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  // Find the event to get image filenames
  const event = await Event.findById(id);

  if (event.picture && event.gallery.length > 0) {
    let result = await cloudinary.uploader.destroy(event.picture.filename); // Assuming image has a filename property
    console.log(`Deleted image ${event.picture.filename}:`, result); // Log the result for debugging
    for (let image of event.gallery) {
    try {
      result = await cloudinary.uploader.destroy(image.filename); // Assuming image has a filename property
        console.log(`Deleted image ${image.filename}:`, result); // Log the result for debugging
      } catch (error) {
        console.error(`Failed to delete image ${image.filename}:`, error);
      }
    }
  }

  await Event.findByIdAndDelete(id);

  req.flash("success", "Successfully deleted event");
  res.redirect("/events");
};

module.exports.downloadFile = async (req, res) => {
  const { id } = req.params;
  const { filename } = req.query;
  const file = cloudinary.utils.cloudinary_url(
    filename,
    (resource_type = "raw")
  );
  res.send({ file });
  // await Event.findByIdAndDelete(id);
  // req.flash("success", "Successfully deleted event");
  // res.redirect("/events");
};
module.exports.gallery = async (req, res) => {
  const { id } = req.params;
  // const { deleteImages } = req.body;
  let event = await Event.findById({ _id: id });
  let imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  event.gallery.push(...imgs);
  await event.save();
  req.flash("success", "Successfully updated event!");
  res.redirect(`/events/${id}`);
  // res.send(event)
};
