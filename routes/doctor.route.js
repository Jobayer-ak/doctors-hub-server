const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
const verifyToken = require("../middlewares/verifyToken");
const adminAuthorization = require("../middlewares/adminAuthorization");
const { verify } = require("jsonwebtoken");

router.get("/doctors", adminAuthorization, doctorController.getAllDoctor);
router.get("/all-doctors", doctorController.getAllDoctor)
router.get("/doctors/slots", doctorController.getTimeSlots);
router.get("/search-doctors", doctorController.searchDoctors);
router.post(
  "/admin/addDoctor",
  verifyToken,
  adminAuthorization,
  doctorController.addDoctor
);
router.delete(
  "/doctor/admin/delete/:email",
  adminAuthorization,
  doctorController.deleteSingleDoctor
);

module.exports = router;
