const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const verifyToken = require("../middlewares/verifyToken");
const adminAuthorization = require("../middlewares/adminAuthorization");

router.get("/doctors", doctorController.getAllDoctor);
router.get("/doctors/slots", doctorController.getTimeSlots);
router.post(
  "/admin/addDoctor",
  verifyToken,
  adminAuthorization,
  doctorController.addDoctor
);

module.exports = router;