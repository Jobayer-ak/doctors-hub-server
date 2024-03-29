const Doctor = require('../models/doctor.model');

// add doctor by admin
exports.addDoctor = async (req, res) => {
  try {
    const email = req.body.email;

    const exist = await Doctor.find({ email });

    if (exist.length !== 0) {
      return res.send({
        status: 403,
        message: 'This doctor is already added.',
      });
    }

    const doctors = await Doctor.create(req.body);

    res.send(doctors);
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      message: error,
    });
  }
};

// get all doctors
exports.getAllDoctor = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    const maxLimit = 100;

    // Set a maximum limit to prevent the client from requesting too many records
    limit = Math.min(limit, maxLimit);

    const totalDoctors = await Doctor.countDocuments({});

    let skip = Math.min((page - 1) * limit, totalDoctors);
    if (limit > totalDoctors) {
      skip = 0;
    }
    const queries = { page, limit, skip };

    queries.pageCount = Math.ceil(totalDoctors / limit);

    const doctors = await Doctor.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by descending order of creation time

    const result = { doctors, queries, page };

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred while fetching all docors.';
    res.status(500).send({ message: errorMessage });
  }
};

// search doctors by any user
exports.searchDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "didn't get doctors",
    });
  }
};

//search specific doctor by any user
exports.searchSingleDoctor = async (req, res) => {
  try {
    const docName = req.query.doctor;

    const doctor = await Doctor.findOne({ name: docName });

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Didn't find the doctor!",
    });
  }
};

// get doctors checkup slots
exports.getTimeSlots = async (req, res) => {
  try {
    const date = req.query.date;

    const gotDate = new Date(date);
    const bookingSlots = await Doctor.aggregate([
      {
        $lookup: {
          from: 'bookings',
          localField: 'name',
          foreignField: 'doctor_name',
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$date', gotDate],
                },
              },
            },
          ],
          as: 'booked',
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
          fee: 1,
          imageURL: 1,
          branch: 1,
          booked: {
            $map: {
              input: '$booked',
              as: 'book',
              in: '$$book.slot',
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
          time_slots: 1,
          fee: 1,
          imageURL: 1,
          slot: {
            $setDifference: ['$time_slots', '$booked'],
          },
        },
      },
    ]);

    res.send(bookingSlots);
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      message: "Couldn't find the time slots for doctors appointment!",
      error: error.message,
    });
  }
};

// delete single doctor
exports.deleteSingleDoctor = async (req, res) => {
  try {
    const email = req.params.email;

    const deleteDoctor = await Doctor.deleteOne({ email: email });

    if (deleteDoctor.deletedCount !== 1) {
      return res.status(403).json({
        success: false,
        message: 'Something Went Wrong!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Deleted',
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
