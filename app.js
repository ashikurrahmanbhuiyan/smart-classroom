const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const compression = require('compression');
const cors = require("cors");
const dotenv = require('dotenv');

// Initialize App
const app = express();

// Passport Config
require('./config/passport')(passport);



dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const mongoURI = isProduction ? process.env.PROD_MONGO_URI : process.env.LOCAL_MONGO_URI;

// Connect to MongoDB is now awosome because it uses environment variables 
// to shift between local and production databases
mongoose.connect(mongoURI)
    .then(() => console.log(`MongoDB Connected: ${isProduction ? 'Production DB' : 'Local DB'}`))
    .catch((err) => console.error('MongoDB connection error:', err));



// EJS
app.set('view engine', 'ejs');

//use pablic folder for css and js
app.use( express.static('public') );

// Compression in request and response
app.use(compression());

// used for send json data to the server
app.use(express.json());
app.use(cors());


// Express Bodyparser
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

app.use('/uploads', express.static('uploads'));


// Routes
app.use('/', require('./routes/dashboard'));
app.use('/teacher', require('./routes/teacher'));
app.use('/student', require('./routes/student'));
app.use('/attendance_sheet', require('./routes/attendance_sheet'));
app.use('/resource_sharing', require('./routes/resource_sharing'));
app.use('/assignments', require('./routes/assignments'));
app.use('/course_tracker', require('./routes/course_tracker'));


// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
