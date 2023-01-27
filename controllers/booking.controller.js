const Booking = require("../models/booking.model");
const { createBookingService } = require("../services/booking.service");

exports.bookingTreatment = async (req, res) => {
  try {
    const booking = req.body;

    const bookInfo = {
      doctor_id: booking.doctor_id,
      date: booking.date,
      slot: booking.slot,
      patient_email: booking.patient_email,
    };

    const exists = await Booking.findOne(bookInfo);

    if (exists) {
      if (
        exists.date === booking.date &&
        exists.doctor_id == booking.doctor_id &&
        exists.slot == booking.slot &&
        exists.patient_email === booking.patient_email
      ) {
        return res.send({
          success: false,
          message: "You already have an Appointment",
        });
      }
    } else {
      const booked = await createBookingService(req.body);

      return res.send({
        success: true,
        message: "Successfully Booked Your Appointment",
        bookingResponse: booked,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

// getting booking details
exports.getBookingDetails = async (req, res) => {
  try {
    const email = req.query.patient;

    if (email === req.user.email) {
      const bookings = await Booking.find({ patientEmail: req.user.email });
      res.send(bookings);
    } else {
      return res.status(403).send({ message: "Forbidden Access" });
    }
  } catch (error) {
    res.send(error);
  }
};
