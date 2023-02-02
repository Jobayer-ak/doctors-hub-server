const Doctor = require("../models/doctor.model");

// add doctor by admin
exports.addDoctor = async (req, res) => {
  try {
    // console.log(req.body);
    const email = req.body.email;

    const exist = await Doctor.find({ email });

    if (exist.length !== 0) {
      return res.send({
        status: 403,
        message: "This doctor is already added.",
      });
    }

    const doctors = await Doctor.create(req.body);

    res.send(doctors);
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error,
    });
  }
};

// get all doctors
exports.getAllDoctor = async (req, res) => {
  try {
    const doctors = await Doctor.find({});

    res.status(200).send(doctors);
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
    });
  }
};

// get doctors checkup slots
exports.getTimeSlots = async (req, res) => {
  try {
    const date = req.query.date;

    const bookingSlots = await Doctor.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "name",
          foreignField: "doctor_name",
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
          _id: 1,
          name: 1,
          email: 1,
          working_hospital: 1,
          higher_degree: 1,
          department: 1,
          speciality: 1,
          time_slots: 1,
          branch: 1,
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
          _id: 1,
          name: 1,
          email: 1,
          working_hospital: 1,
          higher_degree: 1,
          department: 1,
          speciality: 1,
          branch: 1,
          slot: {
            $setDifference: ["$time_slots", "$booked"],
          },
        },
      },
    ]);

    res.send(bookingSlots);
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: "Couldn't find the time slots for doctors appointment!",
      error: error.message,
    });
  }
};
