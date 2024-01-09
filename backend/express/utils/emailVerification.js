const nodemailer = require("nodemailer");

const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChicThread - OTP Email</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; text-align: center;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h1 style="color: #e90000; text-align: center;"><img src="https://i.postimg.cc/4dsLCLsg/logo7.png" alt="ChicThread" style="max-width: 300px;"></h1>
        <p style="font-style: italic; color: #888888; text-align: center;">Elegance Unveiled, Threads of Style Prevail.</p>

        <h2 style="color: #333333; text-align: center;">Your One-Time Password (OTP)</h2>
        <p style="color: #555555; text-align: center;">Please use the following OTP to complete your action:</p>
        <p style="font-size: 24px; font-weight: bold; color: #1109fa; text-align: center;">{OTP_PLACEHOLDER}</p>
        <p style="color: #777777;">Note: This OTP is valid for a single use and should not be shared with anyone.</p>

        <div style="margin-top: 20px; text-align: center; color: #999999;">
            <p>This is an automated email. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;

module.exports = async (email, subject, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "your email",
        pass: "your password",
      }
    });

    const htmlWithCode = emailTemplate.replace("{OTP_PLACEHOLDER}", code);

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      html: htmlWithCode,
    });

    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not Sent!");
    console.log(error);
    return error;
  }
};
