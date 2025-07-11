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





if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

// Determine MongoDB connection string based on environment
const mongoURI = process.env.NODE_ENV === 'production'
    ? process.env.MONGO_URI_PROD // e.g., MongoDB Atlas URI
    : process.env.MONGO_URI_LOCAL || 'mongodb://localhost:27017/smart-classroom';

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB:', mongoURI))
    .catch((err) => console.error('MongoDB connection error:', err));



// Mongodb on cloud 
//  db_password = '6Lakak5cTioy3sSW';
//  mongoose.connect('mongodb+srv://ashikurrahmanbhuiyan:6Lakak5cTioy3sSW@cluster0.89kxn.mongodb.net/smart_classroom?retryWrites=true&w=majority&appName=smart_classroom', {
//     useNewUrlParser: true,
//      useUnifiedTopology: true })
// .then(() => console.log('MongoDB Connected'))
// .catch((err) => console.log(err));


// MongoDB Connection locally
// mongoose
//     .connect('mongodb://localhost:27017/smart-classroom')
//     .then(() => console.log('MongoDB Connected'))
//     .catch((err) => console.log(err));


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
