const nodemailer = require("nodemailer");

// 1. Sending Email
exports.sendMail = (mailInfo) => {
  //Step 1: Creating the transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_EMAIL_PASS,
    },
  });

  //Step 2: Setting up message options
  const messageOptions = {
    subject: mailInfo.subject,
    html: mailInfo.html,
    to: mailInfo.email,
    from: "DOCTOR'S HUB",
  };

  //Step 3: Sending email
  transporter.sendMail(messageOptions);
};
