const Booking = require("../models/booking.model");
const { createBookingService } = require("../services/booking.service");

exports.bookingTreatment = async (req, res) => {
  try {
    const booking = req.body;

    const bookInfo = {
      treatmentName: booking.treatmentName,
      date: booking.date,
      patientName: booking.patientName,
    };

    const exists = await Booking.findOne(bookInfo);

    if (exists) {
      if (exists.date === booking.date) {
        return res.send({
          success: false,
          message: "You already have an Appointment",
        });
      }
    } else {
      const booked = await createBookingService(req.body);

      return res.send({
        success: true,
        message: "Your Appointment is Success",
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
