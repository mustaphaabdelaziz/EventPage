const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProgramSchema = new Schema({
  day: { type: String, default: "day 1" },
  date: { type: Date, default: Date.now() },
  timeline: [
    {
      title: String,
      time: {
        start: String,
        end: String,
      },
    },
  ],
});
module.exports = ProgramSchema;
