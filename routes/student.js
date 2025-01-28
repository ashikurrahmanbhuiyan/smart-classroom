const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { checkNotAuthenticatedstudent } = require('../config/auth');
const User_student = require('../models/user_student');


// Register Page (restricted for authenticated student)
router.get('/register', checkNotAuthenticatedstudent, (req, res) => res.render('studentAuth/student_register'));

// Register Handler
router.post('/register', checkNotAuthenticatedstudent, async (req, res) => {
    const { name, email, student_id, department, year, semester, password, password2 } = req.body;
    const year_semester = year + " " + semester;
    let error1, error2, error3,error4;

    if (password.length < 6) {
        return res.render('student_register', { error1: 'Password must be at least 6 characters', name, student_id , email });
    }
    if (password !== password2) {
        return res.render('student_register', { error2: 'Passwords do not match', name, student_id, email });
    }

    try {
        const existingUser = await User_student.findOne({ email });
        if (existingUser) {
            return res.render('student_register', { error3: 'Email already registered', name, student_id, email});
        }

        const existingUser1 = await User_student.findOne({ student_id });
        if (existingUser1) {
            return res.render('student_register', { error4: 'Student is already exist', name, student_id, email });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User_student({ name, email, student_id, department, year_semester, password: hashedPassword });
        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/student/login');
    } catch (err) {
        console.error(err);
        res.redirect('/student/register');
    }
});

// Login Page (restricted for authenticated student)
router.get('/login', checkNotAuthenticatedstudent, (req, res) => res.render('studentAuth/student_login'));

// Login Handler
router.post('/login', checkNotAuthenticatedstudent, (req, res, next) => {
    passport.authenticate('local-student', {
        successRedirect: '/student/dashboard',
        failureRedirect: '/student/login',
        failureFlash: true,
    })(req, res, next);
});

// Logout Handler
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) throw err;
        req.flash('success_msg', 'You are logged out');
        res.redirect('/student/login');
    });
});



const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/studentPics');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.svg'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedFileTypes.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/update-profile-pic", upload.single("updateProfilePic"), async (req, res) => {
    const { email } = req.body;

    try {
        const pic = await User_student.findOne({ email });
        const oldPicture = pic.picture ? `./public/studentPics/${pic.picture}` : null;

        picture = req.file ? req.file.filename : null;
        const validExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
        if (!picture) {
            return res.redirect('/student/dashboard');
        } else {
            const validation = validExtensions.some(ext => picture.toLowerCase().endsWith(ext));
            if (!validation) {
                return res.redirect('/student/dashboard');
            }
        }
        const userTeacher = await User_student.updateOne(
            { email: email },
            { $set: { picture: picture } }
        );

        if (oldPicture) {
            fs.unlink(oldPicture, (err) => {
                if (err) {

                } else {

                }
            });
        }

        res.redirect('/student/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }

});

module.exports = router;
