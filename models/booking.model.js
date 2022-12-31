const mongoos = require("mongoose");
const validator = require("validator");

const bookingSchema = mongoose.Schema({
  treatmentName: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    trim: true,
    required: true,
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Provide a valid Email!"],
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email address is required"],
      },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
