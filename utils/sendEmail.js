const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

var options = {
  auth: {
    api_key: process.env.EMAIL_SENDER_API_KEY,
  },
};

const client = nodemailer.createTransport(sgTransport(options));

module.exports.sendEmail = (
  doctor_name,
  patient_name,
  patient_email,
  patient_contact_number,
  slot,
  date
) => {
  const email = {
    from: process.env.EMAIL_SENDER,
    to: patient_email,
    subject: `Your APpointment for ${doctor_name} is on ${date} at ${slot} is confirmed`,
    text: `Your APpointment for ${doctor_name} is on ${date} at ${slot} is confirmed`,
    html: `
        <div>
        <h1>Hello ${patient_name}</h1>
        <h3>Your Appointment for ${doctor_name} is confirmed.</h3>
        <p>Looking forward to seeing you on ${date} at ${slot}</p>

        <h3>Our Address</h3>
        <p>Baghmara, Charapara</p>
        <p>Mymensingh</p>
        </div>
      `,
  };

  client.sendMail(email, function (err, res) {
    if (err) {
      console.log(err);
    }
    console.log("Message send: ", res);
  });
};
