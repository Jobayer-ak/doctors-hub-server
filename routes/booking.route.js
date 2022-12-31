const express = require("express");
const { bookingTreatment } = require("../controllers/booking.controller");
const router = express.Router();

router.post("/booking", bookingTreatment);

module.exports = router;
