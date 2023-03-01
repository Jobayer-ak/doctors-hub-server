const Booking = require("../models/booking.model");
const { createBookingService } = require("../services/booking.service");
const { sendMail } = require("../utils/email");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// get all apointments
exports.allAppointments = async (req, res) => {
  try {
    const appointments = await Booking.find({});

    res.status(200).send(appointments);
  } catch (error) {
    res.status(500).send(error);
  }
};

// specific booking appointment
exports.singleAppointment = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Booking.findOne({ _id: id });
    // console.log(result);

    res.status(200).json({
      status: "Success",
      appointment: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      error,
    });
  }
};

// create booking
exports.bookingAppointment = async (req, res) => {
  try {
    const booking = req.body;

    const {
      doctor_name,
      patient_name,
      patient_email,
      patient_contact_number,
      slot,
      date,
      branch,
    } = req.body;

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

      // email html template
      const mailInfo = {
        email: patient_email,
        subject: "Appointment Confirmation Email",
        html: `
        <div>
        <h2>Hello ${patient_name}</h2>
        <h3>Your Appointment for ${doctor_name} is confirmed.</h3>
        <p>Looking forward to seeing you on ${date} at ${slot} in ${branch} branch.</p>

        <h3>Our Address</h3>
        <p>Baghmara, Charapara</p>
        <p>Mymensingh</p>
        </div>
      `,
      };

      // send email to user
      sendMail(mailInfo);

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

      // console.log("All bookings: ", bookings);

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

      // console.log(pending);

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
    const email = req.params.email;

    console.log("Email: ", email);

    const deleteBooking = await Booking.deleteOne({ email: email });

    if (deleteBooking.deletedCount !== 1) {
      return res.status(403).json({
        success: false,
        message: "Something Went Wrong!",
      });
    }

    // console.log(deleteBooking);

    res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// payment intent
exports.paymentIntent = async (req, res) => {
  try {
    const bookFee = req.body;
    const fee = bookFee.fee;
    const amount = fee * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    console.log(paymentIntent)

    res.status(200).json({
      status: "Success",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {}
};
