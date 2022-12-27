const mongoose = require("mongoose");
const Slot = require("../models/slots.model");
const { getSlotsService } = require("../services/slots.service");

exports.getSlots = async (req, res) => {
  try {
    const slots = await getSlotsService();
    console.log(req.cookies);

    res.status(200).json({
      status: "Success",
      data: slots,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Couldn't find the time slots for doctors appointment!",
      error: error.message,
    });
  }
};
