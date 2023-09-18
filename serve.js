#!/usr/bin/env node
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes (you can configure it more restrictively)
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle POST request for form submission
app.post('/submit-form', (req, res) => {
  const formData = req.body;

  if (formData) {
    // Successful submission
    res.status(200).json({ message: 'Thank you for your submission.', data: formData });
    alert("it worked");
    console.log("It worked");
  } else {
    // Invalid submission
    res.status(400).json({ message: 'Your submission is invalid, please try again.' });
    alert("did NOT work");
    console.log("Didn't work");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
