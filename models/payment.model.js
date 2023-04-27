const mongoose = require('mongoose');
const validator = require('validator');

const paymentSchema = mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: [true, 'Appointment Id is required'],
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction Id is required'],
    },
    patient_name: {
      type: String,
      trim: true,
      required: [true, 'Patient name is required'],
    },
    patient_email: {
      type: String,
      validate: [validator.isEmail, 'Provide a valid Email!'],
      trim: true,
      lowercase: true,
      required: [true, 'Email address is required'],
    },
    // doctor_email: {
    //   type: String,
    //   validate: [validator.isEmail, 'Provide a valid Email!'],
    //   trim: true,
    //   lowercase: true,
    //   required: [true, 'Email address is required'],
    // },
    doctor_name: {
      type: String,
      trim: true,
      required: [true, 'Doctor name is required'],
    },
    speciality: {
      type: String,
      trim: true,
      required: [true, 'Doctor speciality is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    slot: {
      type: String,
      required: [true, 'Slot is required'],
    },
    branch: {
      type: String,
      required: [true, 'Branch name is required!'],
    },
    fee: {
      type: String,
      required: [true, 'Fee is required'],
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
