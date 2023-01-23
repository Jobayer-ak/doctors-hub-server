const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.Types.ObjectId;

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email!"],
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, "Email address is required"],
    },
    contact_number: {
      type: String,
      validate: [
        validator.isMobilePhone,
        "Please provide a valid contact number!",
      ],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    working_hospital: {
      type: String,
      required: true,
    },
    treatment_area: {
      type: String,
      required: true,
    },
    studied_medical_college: {
      type: String,
      required: true,
    },
    higher_degree: {
      type: String,
      required: true,
    },
    blood_group: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
