var nodemailer = require("nodemailer");
var mailConfig = require("../config/mailConfig");

//////////////////////////////////////////////////////////////////////////////////////

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: mailConfig,
  tls: true
});

//////////////////////////////////////////////////////////////////////////////////////

const sendMail = (to, html, subject) => {
  var mailOptions = {
    from: mailConfig.user,
    to,
    subject,
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent to " + to);
    }
  });
};

//////////////////////////////////////////////////////////////////////////////////////

module.exports = sendMail;

//////////////////////////////////////////////////////////////////////////////////////
