const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
