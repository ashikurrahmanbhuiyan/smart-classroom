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
    }catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }
});

module.exports = router;
