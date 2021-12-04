const nodemailer = require('nodemailer');

async function sendEmail({ subject, html, to }) {
  if (to === 'admin') {
    // eslint-disable-next-line no-param-reassign
    to = 'tomisargiottob@hotmail.com';
  }
  const transporter = nodemailer.createTransport(
    {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ian.beahan71@ethereal.email',
        pass: 'W8K2UNvtd3qxt61BvV',
      },
    },
  );

  const mailOptions = {
    from: 'Ecommerce',
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendEmail;
