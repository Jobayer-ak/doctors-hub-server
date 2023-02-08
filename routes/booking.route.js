const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const verifyToken = require("../middlewares/verifyToken");
const adminAuthorization = require("../middlewares/adminAuthorization");

router.get("/all-appointments", bookingController.allAppointments)
router.get("/bookings", verifyToken, bookingController.getBookingDetails);
router.get("/pending-appointments", verifyToken, bookingController.pendingAppointments);
router.post("/booking", verifyToken, bookingController.bookingAppointment);
router.delete("/booking/delete/:id", verifyToken, bookingController.singleBookDelete)

module.exports = router;
  