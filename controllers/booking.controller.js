const Booking = require("../models/booking.model");
const { createBookingService } = require("../services/booking.service");

exports.allAppointments = async (req, res) => {
  try {
    const appointments = await Booking.find({});

    console.log("ALl apointments: ", appointments);

    res.status(200).send(appointments);
  } catch (error) {
    res.status(500).send(error);
  }
};

// exports.allAppointments = async (req, res) => {
//   try {
//     console.log("hello: ",req.user)
//     if (req.user.role !== "admin") {
//       return res.status(403).json({
//         status: "Failed",
//         message: "You are not permitted to book appointment.",
//       });
//     }

//     const appointments = await Booking.find({});
//     console.log("Appointments: ", appointments);
//     res.send("Hello");
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error,
//     })
//   }
// }

exports.bookingAppointment = async (req, res) => {
  try {
    const booking = req.body;

    if (req.user.role === "admin") {
      return res.status(403).json({
        status: "Failed",
        message: "You are not permitted to book appointment.",
      });
    }

    const bookInfo = {
      doctor_id: booking.doctor_id,
      date: booking.date,
      slot: booking.slot,
      patient_email: booking.patient_email,
    };

    const exists = await Booking.findOne(bookInfo);

    if (exists) {
      if (
        exists.date === booking.date &&
        exists.doctor_id == booking.doctor_id &&
        exists.slot == booking.slot &&
        exists.patient_email === booking.patient_email
      ) {
        return res.send({
          success: false,
          message: "You already have an Appointment",
        });
      }
    } else {
      const booked = await createBookingService(req.body);

      return res.send({
        success: true,
        message: "Successfully Booked Your Appointment",
        bookingResponse: booked,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

// getting booking details
exports.getBookingDetails = async (req, res) => {
  try {
    const email = req.query.patient;

    if (email === req.user.email) {
      const bookings = await Booking.find({
        patient_email: req.user.email,
      }).sort({ date: -1 });

      console.log("All bookings: ", bookings);

      res.status(200).send(bookings);
    } else {
      return res.status(403).send({ message: "Forbidden Access" });
    }
  } catch (error) {
    res.send(error);
  }
};

// getting pending bookings
exports.pendingAppointments = async (req, res) => {
  try {
    const email = req.query.patient;
    const date = req.query.date;

    if (email === req.user.email) {
      const pending = await Booking.find({
        patient_email: email,
        date: { $gte: date },
      }).sort({ date: -1 });

      console.log(pending)

      res.status(200).send(pending);
    } else {
      return res.status(403).send({ message: "Forbidden Access" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// delete booking
exports.singleBookDelete = async (req, res) => {
  try {
    const id = req.params.id;

    const deleteBooking = await Booking.deleteOne({ _id: id });

    if (deleteBooking.deletedCount !== 1) {
      return res.status(403).json({
        success: false,
        message: "Something Went Wrong!",
      });
    }

    console.log(deleteBooking);

    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
