const express = require('express');
const { checkAuthenticatedteacher } = require('../config/auth');
const router = express.Router();


router.get('/',checkAuthenticatedteacher, async (req, res) => {
    // console.log(req.user.name);
    course_name = req.query.course_name;
    res.render('course_pages/course_tracker', { page: 'course_tracker',course_name: course_name });
});

module.exports = router;