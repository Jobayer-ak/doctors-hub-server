const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const verifyToken = require('../middlewares/verifyToken');
const adminAuthorization = require('../middlewares/adminAuthorization');

router.get('/all-appointments', bookingController.allAppointments);
router.get('/bookings', verifyToken, bookingController.getBookingDetails);

router.get(
  '/pending-appointments',
  verifyToken,
  bookingController.pendingAppointments
);
router.post('/booking', verifyToken, bookingController.bookingAppointment);
router.post(
  '/create-payment-intent',
  verifyToken,
  bookingController.paymentIntent
);
router.get('/booking/:id', verifyToken, bookingController.singleAppointment);
router.patch(
  '/booking/:id',
  verifyToken,
  bookingController.updateSingleAppointment
);
router.delete(
  '/booking/delete/:email',
  verifyToken,
  bookingController.singleBookDelete
);

module.exports = router;
