const Booking = require("../models/booking.model");

exports.createBookingService = async (bookingInfo) => {
  const booking = await Booking.create(bookingInfo);
  return booking;
};
