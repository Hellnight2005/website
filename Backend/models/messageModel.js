const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    selectDay: {
      type: String,
      required: true,
    },
    selectTime: {
      type: String,
      required: true,
    },
    slot: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["upcoming", "line up"],
      default: "line up",
    },
    user_role: {
      type: String,
      enum: ["user", "Admin"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);
