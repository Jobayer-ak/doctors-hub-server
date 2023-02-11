const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.Types.ObjectId;

const bookingSchema = mongoose.Schema( 
  {
    doctor_name: {
      type: String,
      required: [true, "Doctor name is required"],
    },
    doctor_id: [
      {
        type: ObjectId, 
        ref: "Doctor",
      },
    ],
    patient_name: {
      type: String,
      trim: true,
      required: [true, "Patient name is required"],
    },
    patient_email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email!"],
      trim: true,
      lowercase: true,
      required: [true, "Email address is required"],
    },
    patient_contact_number: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number!",
      ],
      required: [true, "Mobile number is required"],
    },
    slot: {
      type: String,
      required: [true, "Slot is required"],
    },
    speciality: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    branch: {
      type: String,
      required: [true, "Branch name is required!"],
    }
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;


// get only date-month-year