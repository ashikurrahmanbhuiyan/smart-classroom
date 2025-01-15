const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { checkNotAuthenticatedteacher } = require('../config/auth');
const User_teacher = require('../models/user_teacher');
const { log } = require('node:console');



// Login Page (restricted for authenticated teacher)
router.get('/login', checkNotAuthenticatedteacher, (req, res) => res.render('login'));

// Register Page (restricted for authenticated teacher)
router.get('/register', checkNotAuthenticatedteacher, (req, res) => res.render('register'));

// Register Handler
router.post('/register', checkNotAuthenticatedteacher, async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let error1, error2, error3;

    if (password.length < 6) {
        return res.render('register', { error1: 'Password must be at least 6 characters', name, email });
    }
    if (password !== password2) {
        return res.render('register', { error2: 'Passwords do not match', name, email });
    }

    try {
        const existingUser = await User_teacher.findOne({ email });
        if (existingUser) {
            return res.render('register', { error3: 'Email already registered', name, email });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User_teacher({ name, email, password: hashedPassword });
        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/teacher/login');
    } catch (err) {
        console.error(err);
        res.redirect('/teacher/register');
    }
});

// Login Handler
router.post('/login', checkNotAuthenticatedteacher, (req, res, next) => {
    passport.authenticate('local-teacher', {
        successRedirect: '/teacher/dashboard',
        failureRedirect: '/teacher/login',
        failureFlash: true,
    })(req, res, next);
});

// Logout Handler
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) throw err;
        req.flash('success_msg', 'You are logged out');
        res.redirect('/teacher/login');
    });
});

router.post("/update-name", async (req, res) => {
    const { name, email } = req.body;
    try {
        const userTeacher = await User_teacher.updateOne(
            { email: email },
            { $set: { name } }
        );
        res.redirect('/teacher/dashboard')
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }
});


// for uploads profile pics

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/profilePics');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });
router.post("/update-profile-pic", upload.single("updateProfilePic"), async (req, res) => {
    const { email } = req.body;
    var picture = req.file ? req.file.filename : null;
    const validExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
    if (!picture) {
        picture = "img.jpg";
    } else {
        const validation = validExtensions.some(ext => picture.toLowerCase().endsWith(ext));
        if (!validation) {
            picture = "img.jpg";
        }
    }
    try {
        const userTeacher = await User_teacher.updateOne(
            { email: email },
            { $set: { picture: picture } }
        );
        res.redirect('/teacher/dashboard')
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }
});


// for updating positon
router.post("/update-position", async (req, res) => {
    const { position, email } = req.body;
    try {
        const userTeacher = await User_teacher.updateOne(
            { email: email },
            { $set: { position } }
        );
        res.redirect('/teacher/dashboard')
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }
});


// contact section

router.post("/update-contact", async (req, res) => {
    const { contact, email } = req.body;
    try {
        const userTeacher = await User_teacher.updateOne(
            { email: email },
            { $set: { contact } }
        );
        res.redirect('/teacher/dashboard')
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }
});


// Educational Qualification

router.post("/update-education", async (req, res) => {
        let {institute, degree, email} = req.body;
        const pro = await User_teacher.findOne({email : email})
        .then((edu) => {
            if(edu){
                edu.educations.push({
                    institute : institute, 
                    qualification : degree
                });
                edu.save();
            }else{
                const newEdu = new User_teacher({
                    educations: [{
                        institute : institute, 
                        qualification : degree 
                    }]
                });
               newEdu.save(); 
            }
        });
        res.redirect('/teacher/dashboard');
    });


    router.post("/update-research", async (req, res) => {
        let {research, email} = req.body;
        const pro = await User_teacher.findOne({email : email})
        .then((interest) => {
            if(interest){
               interest.researchs.push({
                    research : research 
                    
                });
                interest.save();
            }else{
                const newRs = new User_teacher({
                    researchs: [{
                        research : research, 
                    }]
                });
               newRs.save(); 
            }
        });
        res.redirect('/teacher/dashboard');
    });

module.exports = router;
