const nodemailer = require('nodemailer');
const User = require('../user/model/userModel');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "your email",
    pass: "your password",
  },
});

const sendNotificationEmail = async ({ name, email, message }) => {
  try {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'your email',
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendNotificationEmail };