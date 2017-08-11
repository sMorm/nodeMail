// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const iplocation = require('iplocation')

// Initialize app
const app = express();
const PORT = 5000; // because Heroku...

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false,
}));

// Allow CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Endpoint for page w/ UI
app.post('/send', (req, res) => {
  const { name, address, subject, text } = req.body;
  let mailOptions = {
    from: `${name} <${address}>`,
    to: 'sereymorm@gmail.com',
    subject: subject,
    text: `Message from: ${address}, ${text}`, 
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          res.send(error);
      }
      res.send(`Successfully sent mail`);
  });
});

// Endpoint for API
app.get('/send/:name/:address/:subject/:text', (req, res) => {
  const { name, address, subject, text } = req.params;

  iplocation(req.clientIp, (error, response) => {
    const { ip, country_code, region_name, city, zip_code, longitude, latitude } = response;

    let mailOptions = {
      from: `${name} <${address}>`,
      to: 'receiver-email',
      subject: subject,
      html: `<html><body> ${text}<br/><br/>Sender Info:<br/>IP:${ip}<br/>${city}, ${region_name} ${country_code}<br/>Exact Location: https://www.google.com/maps/?q=${latitude},${longitude}</body></html>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send(error);
        }
        res.send(`Successfully sent mail`);
    });
  })
});



app.listen(PORT, () => {
  console.log(`Started listening on port ${PORT}...`)
});


// Mail configuration
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'some-email@gmail.com',
    pass: 'email-password-here'
  }
});