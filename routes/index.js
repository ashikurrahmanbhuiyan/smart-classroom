const express = require('express');
const router = express.Router();
const { checkAuthenticatedteacher } = require('../config/auth');
const { checkAuthenticatedstudent } = require('../config/auth');
const { authenticate } = require('passport');


// Home Page (public)
router.get('/', (req, res) => res.redirect('/teacher/login'));

// Dashboard (protected, requires authentication)
router.get('/teacher/dashboard', checkAuthenticatedteacher, (req, res) =>
    res.render('dashboard', { user: req.user })
);

router.get('/student/dashboard',checkAuthenticatedstudent, (req, res) =>
    res.render('student_dashboard', { user: req.user })
);

module.exports = router;
