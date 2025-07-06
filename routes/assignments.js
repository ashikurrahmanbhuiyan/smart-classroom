const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    console.log(req.user);
    res.render('course_pages/layout', { page: 'assignments' });
});

module.exports = router;