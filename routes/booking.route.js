const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const verifyToken = require("../middlewares/verifyToken");


router.get("/bookings", verifyToken, bookingController.getBookingDetails);
router.get("/pending-appointments", verifyToken, bookingController.pendingAppointments);
router.post("/booking", verifyToken, bookingController.bookingAppointment);

module.exports = router;
  