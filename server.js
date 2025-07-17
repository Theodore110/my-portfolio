// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public')); // Serve static HTML/CSS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to handle contact form
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,    // Your Gmail address
            pass: process.env.EMAIL_PASS     // Your Gmail app password
        },
        tls: {
            rejectUnauthorized: false // <-- allow self-signed certs
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Contact from ${name}`,
        text: `Message from ${name} <${email}>:\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Email send failed:', error);
            res.status(500).send('Error sending message.');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Message sent successfully!');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
