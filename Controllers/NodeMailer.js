const nodemailer = require("nodemailer");
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"Hey 👻"',
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
    });
});

module.exports = sendEmail;