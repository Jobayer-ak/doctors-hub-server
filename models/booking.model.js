const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.Types.ObjectId;

const bookingSchema = mongoose.Schema(
  {
    treatmentName: {
      type: String,
      required: true,
    },
    // treatmentId: {
    //   type: String,
    //   // required: true,
    // },
    treatmentId: [
      {
        type: ObjectId,
        ref: "Slot",
      },
    ],
    patientName: {
      type: String,
      trim: true,
      required: true,
    },
    patientEmail: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email!"],
      trim: true,
      lowercase: true,
      required: [true, "Email address is required"],
    },
    contactNumber: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number!",
      ],
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
