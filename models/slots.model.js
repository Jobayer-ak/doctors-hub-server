const mongoose = require("mongoose");

const slotsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Slot = mongoose.model("Slot", slotsSchema);

module.exports = Slot;
