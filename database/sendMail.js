const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: "your port",
    auth: {
      user: "your mail",
      pass: "your mail app pass",
    },
  });
  module.exports = transporter