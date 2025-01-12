const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../config/auth');


// Home Page (public)
// router.get('/', (req, res) => res.redirect('/users/login'));
router.get('/', (req, res) => res.redirect('/teacher/login'));

// Dashboard (protected, requires authentication)
router.get('/dashboard', checkAuthenticated, (req, res) =>
    res.render('dashboard', { user: req.user })
);

module.exports = router;
