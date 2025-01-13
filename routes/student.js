const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { checkNotAuthenticatedstudent } = require('../config/auth');
const User_student = require('../models/user_student');


// Register Page (restricted for authenticated student)
router.get('/register', checkNotAuthenticatedstudent, (req, res) => res.render('student_register'));

// Register Handler
router.post('/register', checkNotAuthenticatedstudent, async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let error1, error2, error3;
    if (password.length < 6) {
        return res.render('student_register', { error1: 'Password must be at least 6 characters', name , email });
    }
    if (password !== password2) {
        return res.render('student_register', { error2: 'Passwords do not match', name, email });
    }

    try {
        const existingUser = await User_student.findOne({ email });
        if (existingUser) {
            return res.render('student_register', { error3: 'Email already registered', name, email});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User_student({ name, email, password: hashedPassword });
        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/student/login');
    } catch (err) {
        console.error(err);
        res.redirect('/student/register');
    }
});

// Login Page (restricted for authenticated student)
router.get('/login', checkNotAuthenticatedstudent, (req, res) => res.render('student_login'));

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

module.exports = router;
