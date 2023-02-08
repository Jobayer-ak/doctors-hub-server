const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const verifyToken = require("../middlewares/verifyToken");
const adminAuthorization = require("../middlewares/adminAuthorization");
const { verify } = require("jsonwebtoken");

router.get("/doctors", adminAuthorization, doctorController.getAllDoctor);
router.get("/doctors/slots", verifyToken, doctorController.getTimeSlots);
router.post(
  "/admin/addDoctor",
  verifyToken,
  adminAuthorization,
  doctorController.addDoctor
);

module.exports = router;