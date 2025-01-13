const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// Initialize App
const app = express();

// Passport Config
require('./config/passport')(passport);


// MongoDB Connection
mongoose
    .connect('mongodb://localhost:27017/login-system', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));

// EJS
app.set('view engine', 'ejs');

//use pablic folder for css and js
app.use( express.static('public') );


// Body Parser
app.use(express.urlencoded({ extended: false }));

// Express Session Middleware
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash Middleware
app.use(flash());

// Global Variables for Flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/teacher', require('./routes/teacher'));
app.use('/student', require('./routes/student'));

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
