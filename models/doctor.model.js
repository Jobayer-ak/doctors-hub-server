const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.Types.ObjectId;

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [3, "Name should be at least 3 characters"],
      maxLength: [40, "Name is too large"],
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
      minLength: [3, "Name should be at least 3 characters"],
      maxLength: [60, "Name is too large"],
    },
    nid: {
      type: String,
      required: true,
      trimg: true,
    },
    gender: {
      type: String,
      required: true,
      trimg: true,
    },
    working_hospital: {
      type: String,
      required: true,
      trimg: true,
    },
    speciality: {
      type: String,
      required: true,
      trimg: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    higher_degree: {
      type: String,
      required: true,
      trimg: true,
    },
    branch: {
      type: String,
      required: true,
      trimg: true,
    },
    blood_group: {
      type: String,
      required: true,
      trimg: true,
    },
    time_slots: {
      type: Array,
      required: true,
    },
    fee: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
