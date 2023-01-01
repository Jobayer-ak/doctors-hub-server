const { createBookingService } = require("../services/booking.service");

exports.bookingTreatment = async (req, res) => {
  try {
    // console.log("heelo");

    console.log(req.body);
    const booked = await createBookingService(req.body);
    console.log(55);
    res.status(200).json({
      status: "Success",
      message: "Successfully Signed Up!",
      bookingResponse: booked,
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
