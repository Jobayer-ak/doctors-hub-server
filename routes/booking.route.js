const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const verifyToken = require("../middlewares/verifyToken");

router.post("/booking", bookingController.bookingTreatment);

module.exports = router;
