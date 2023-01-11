const express = require("express");
const router = express.Router();
const slots = require("../controllers/slot.controller");
const verifyToken = require("../middlewares/verifyToken");


// get time slots
router.get("/slots", verifyToken, slots.getSlots);

module.exports = router;
