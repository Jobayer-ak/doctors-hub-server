const mongoose = require("mongoose");
const Slot = require("../models/slots.model");
const { getSlotsService } = require("../services/slots.service");
const Booking = require("../models/booking.model");

exports.getSlots = async (req, res) => {
  try {
    const date = req.query.date;

    const bookingSlots = await Slot.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "name",
          foreignField: "treatmentName",
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$date", date],
                },
              },
            },
          ],
          as: "booked",
        },
      },
      {
        $project: {
          name: 1,
          slots: 1,
          booked: {
            $map: {
              input: "$booked",
              as: "book",
              in: "$$book.slot",
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          slots: {
            $setDifference: ["$slots", "$booked"],
          },
        },
      },
    ]);

    // console.log(bookingSlots);

    res.status(200).json({
      status: "Success",
      data: bookingSlots,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Couldn't find the time slots for doctors appointment!",
      error: error.message,
    });
  }
};
