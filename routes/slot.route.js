const express = require("express");
const router = express.Router();
const slots = require("../controllers/slot.controller");
const verifyToken = require("../middlewares/verifyToken");
const verifyToken2 = require("../middlewares/verifyToken2");

// get time slots
router.get("/slots", verifyToken, slots.getSlots);

module.exports = router; 
