const Booking = require('../models/booking.model');
const Payment = require('../models/payment.model');
const { createBookingService } = require('../services/booking.service');
const { sendMail } = require('../utils/email');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// get all apointments
exports.allAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const maxLimit = 100;

    // Set a maximum limit to prevent the client from requesting too many records
    limit = Math.min(limit, maxLimit);

    const totalAppointments = await Booking.countDocuments({});

    let skip = Math.min((page - 1) * limit, totalAppointments);

    if (limit > totalAppointments) {
      skip = 0;
    }

    const queries = { page, limit, skip };

    queries.pageCount = Math.ceil(totalAppointments / limit);

    const appointments = await Booking.find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by descending order of creation time

    const result = { appointments, queries };

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred while fetching appointments.';
    res.status(500).send({ message: errorMessage });
  }
};

// specific booking appointment
exports.singleAppointment = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Booking.findOne({ _id: id });

    res.status(200).json({
      status: 'Success',
      appointment: result,
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      error,
    });
  }
};

// update specific booked appointment
exports.updateSingleAppointment = async (req, res) => {
  try {
    const id = req.params.id;

    console.log('Id: ', id);

    if (!req.body) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Something went wrong! Try again!',
      });
    }

    const bodyData = {
      appointmentId: req.body.payment.appointment,
      transactionId: req.body.payment.transactionId,
      patient_name: req.body.payment.patient_name,
      patient_email: req.body.payment.patient_email,
      doctor_name: req.body.payment.doctor_name,
      speciality: req.body.payment.speciality,
      date: req.body.payment.date,
      slot: req.body.payment.slot,
      branch: req.body.payment.branch,
      fee: req.body.payment.fee,
    };

    const tran = await Payment.create(bodyData);

    const filter = { _id: id };
    const update = { paid: true };
    const bookedAppointment = await Booking.updateOne(filter, update);

    if (!bookedAppointment.modifiedCount) {
      return res.status(403).json({
        status: 'Failed',
        message: 'Something went wrong with payment! Try again!',
      });
    } else {
      // email html template
      const mailInfo = {
        email: req.body.payment.patient_email,
        subject: 'Payment Confirmation E-mail',
        html: `
      <div style="padding:10px; text-align: center; background:#23075e">
      <h2>Hello ${req.body.payment.patient_name}</h2>
      <h3>You paid $${req.body.payment.fee} for ${req.body.payment.doctor_name}.</h3>
      <p>Looking forward to seeing you on ${req.body.payment.date} at ${req.body.payment.slot} in ${req.body.payment.branch} branch.</p>

      <h3>Our Address</h3>
      <p>Baghmara, Charapara</p>
      <p>Mymensingh</p>
      </div>
    `,
      };

      // send email to user
      sendMail(mailInfo);

      console.log('paid status: ', bookedAppointment);

      res.status(200).json({
        status: 'success',
        message: 'Successfully payment has been completed!',
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
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

    if (req.user.role === 'admin') {
      return res.status(403).json({
        status: 'Failed',
        message: 'You are not permitted to book appointment.',
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
          message: 'You already have an Appointment',
        });
      }
    } else {
      const booked = await createBookingService(req.body);

      // email html template
      const mailInfo = {
        email: patient_email,
        subject: 'Appointment Confirmation Email',
        html: `
        <div style="padding:10px; text-align: center; background:#23075e">
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
        message: 'Successfully Booked Your Appointment',
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
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const maxLimit = 100;

    // Set a maximum limit to prevent the client from requesting too many records
    limit = Math.min(limit, maxLimit);

    const totalAppointments = await Booking.countDocuments({});

    let skip = Math.min((page - 1) * limit, totalAppointments);

    if (limit > totalAppointments) {
      skip = 0;
    }

    const queries = { page, limit, skip };

    queries.pageCount = Math.ceil(totalAppointments / limit);

    const appointments = await Booking.find({ patient_email: req.user.email })
      .skip(skip)
      .limit(limit)
      .sort({ date: -1 }); // Sort by descending order of creation time

    const result = { appointments, queries };

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    const errorMessage = 'An error occurred while fetching appointments.';
    res.status(500).send({ message: errorMessage });
  }
};

// getting pending bookings
exports.pendingAppointments = async (req, res) => {
  try {
    const email = req.query.patient;
    const date = req.query.date;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    const maxLimit = 100;

    // Set a maximum limit to prevent the client from requesting too many records
    limit = Math.min(limit, maxLimit);

    const pendingAppointments = await Booking.countDocuments({
      patient_email: email,
      date: { $gte: date },
    });

    let skip = Math.min((page - 1) * limit, pendingAppointments);

    if (limit > pendingAppointments) {
      skip = 0;
    }

    const queries = { page, limit, skip };

    queries.pageCount = Math.ceil(pendingAppointments / limit);

    const appointments = await Booking.find({
      patient_email: email,
      date: { $gte: date },
    })
      .skip(skip)
      .limit(limit);
    // Sort by descending order of creation time

    const result = { pendingAppointments, appointments, queries };

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    const errorMessage =
      'An error occurred while fetching pending appointments.';
    res.status(500).send({ message: errorMessage });
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

// payment intent
exports.paymentIntent = async (req, res) => {
  try {
    const { fee } = req.body;

    const amount = fee * 100;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(200).json({
      status: 'Success',
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      status: 'Failed',
      erorr: error.message,
    });
  }
};
