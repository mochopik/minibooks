const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

//Load mongoose models
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Load Router
const index = require('./routes/index');
const auth = require('./routes/auth');
const keys = require('./config/keys');

// Mongoose connection
mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Setting up global variable
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Use Routes
app.use('/', index);
app.use('/auth', auth);

// Static public directory
app.use(express.static(path.join(__dirname, 'public')));

const port  = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});