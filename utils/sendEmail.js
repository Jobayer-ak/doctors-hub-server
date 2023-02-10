const nodemailer = require("nodemailer");

// 1. Sending Email
exports.sendMail = (mailInfo) => {
  //Step 1: Creating the transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    // secure: false, // true for 465, false for other ports
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

// const nodemailer = require("nodemailer");
// const sgTransport = require("nodemailer-sendgrid-transport");

// var options = {
//   auth: {
//     api_key: process.env.EMAIL_SENDER_API_KEY,
//   },
// };

// const client = nodemailer.createTransport(sgTransport(options));

// module.exports.sendEmail = (
//   doctor_name,
//   patient_name,
//   patient_email,
//   patient_contact_number,
//   slot,
//   date
// ) => {
//   const email = {
//     from: process.env.EMAIL_SENDER,
//     to: patient_email,
//     subject: `Your APpointment for ${doctor_name} is on ${date} at ${slot} is confirmed`,
//     text: `Your APpointment for ${doctor_name} is on ${date} at ${slot} is confirmed`,
//     html: `
//         <div>
//         <h1>Hello ${patient_name}</h1>
//         <h3>Your Appointment for ${doctor_name} is confirmed.</h3>
//         <p>Looking forward to seeing you on ${date} at ${slot}</p>

//         <h3>Our Address</h3>
//         <p>Baghmara, Charapara</p>
//         <p>Mymensingh</p>
//         </div>
//       `,
//   };

//   client.sendMail(email, function (err, res) {
//     if (err) {
//       console.log(err);
//     }
//     console.log("Message send: ", res);
//   });
// };
