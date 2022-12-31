const Booking = require("../models/booking.model");

exports.bookingTreatment = async (req, res) => {
  try {
    const bookingInfo = req.body;
    const booked = await Booking.create(bookingInfo);

    res.status(200).json({
      status: "Success",
      message: "Successfully Signed Up!",
      bookingResponse: booked,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
