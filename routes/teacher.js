const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { checkNotAuthenticated } = require('../config/auth');
const User = require('../models/User');

// Login Page (restricted for authenticated teacher)
router.get('/login', checkNotAuthenticated, (req, res) => res.render('login'));

// Register Page (restricted for authenticated teacher)
router.get('/register', checkNotAuthenticated, (req, res) => res.render('register'));

// Register Handler
router.post('/register', checkNotAuthenticated, async (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        return res.render('register', { errors, name, email, password, password2 });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('success_msg', 'You are now registered and can log in');
            return res.render('register', { errors, name, email, password, password2 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/teacher/login');
    } catch (err) {
        console.error(err);
        res.redirect('/teacher/register');
    }
});

// Login Handler
router.post('/login', checkNotAuthenticated, (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
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

module.exports = router;
