// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors('http://localhost:3000'));
// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/register', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define a User model
const User = mongoose.model('User', {
  name: String,
  email: String,
  verificationCode: String,
  isVerified: Boolean,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'youremail@gmail.com',
    pass: 'password',
  },
});

// Endpoint for user registration
app.post('/register', (req, res) => {
  const { name, email } = req.body;

  // Generate a random verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Create a new user instance
  const newUser = new User({
    name,
    email,
    verificationCode,
    isVerified: false,
  });

  // Save the user to the database
  newUser.save()
    .then(() => {
      // Send verification email
      const mailOptions = {
        from: 'youremail@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Your verification code is: ${verificationCode}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: 'Failed to send verification email' });
        } else {
          console.log('Email sent: ' + info.response);
          res.json({ message: 'Verification email sent' });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Failed to register user' });
    });
});

// Endpoint for email verification
app.post('/verify', (req, res) => {
  const { email, verificationCode } = req.body;

  // Find the user by email and verification code
  User.findOne({ email, verificationCode })
    .then((user) => {
      if (user) {
        user.isVerified = true;
        user.save()
          .then(() => res.json({ message: 'Email verified successfully' }))
          .catch((err) =>
            res.status(500).json({ error: 'Failed to verify email' })
          );
      } else {
        res.status(400).json({ error: 'Invalid verification code' });
      }
    })
    .catch((err) =>
      res.status(500).json({ error: 'Failed to verify email' })
    );
});

// Start the server
const port = 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
