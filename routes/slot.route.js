const express = require("express");
const router = express.Router();
const slots = require("../controllers/slot.controller");


// get time slots
router.route("/").get(slots.getSlots);

module.exports = router;