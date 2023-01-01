const Booking = require("../models/booking.model");
const { createBookingService } = require("../services/booking.service");

exports.bookingTreatment = async (req, res) => {
  try {
    const booking = req.body;
    // const booking = {
    //   treatmentName: name,
    //   treatmentId: _id,
    //   patientName: user.userName,
    //   patientEmail: user.userEmail,
    //   contactNumber: e.target.phone.value,
    //   slot: e.target.slot.value,
    //   date: formatedDate,
    // }
    const bookInfo = {
      treatmentName: booking.treatmentName,
      date: booking.date,
      patientName: booking.patientName,
    };

    // console.log(req.body);

    const exists = await Booking.findOne(bookInfo);

    if (exists) {
      if (exists.date === booking.date) {
        // console.log("inside");
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
