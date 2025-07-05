const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    console.log(req.user);
    // res.render('course_pages/resource_sharing');
    res.render('course_pages/layout', { page: 'resource_sharing' });
});

module.exports = router;