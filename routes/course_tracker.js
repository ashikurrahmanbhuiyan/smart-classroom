const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    console.log(req.user);
    res.render('course_pages/layout', { page: 'course_tracker' });
});

module.exports = router;