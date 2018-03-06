const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Passport config
require('./config/passport')(passport);

// Load Router
const auth = require('./routes/auth');

const app = express();

app.get('/', (req, res) => {
    res.send('Its Works!');
});

// Use Routes
app.use('/auth', auth);

const port  = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});