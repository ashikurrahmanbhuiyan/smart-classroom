const express = require('express');
const router = express.Router();
const { checkAuthenticatedteacher } = require('../config/auth');
const { checkAuthenticatedstudent } = require('../config/auth');
const { authenticate } = require('passport');
const Course = require('../models/course');


// Home Page (public)
router.get('/', (req, res) => res.redirect('/teacher/login'));

// Dashboard (protected, requires authentication)
router.get('/teacher/dashboard', checkAuthenticatedteacher, async (req, res) => {
    const findCourses = await Course.findOne({ department: req.user.department });
    var coursesByTeacher;
    if (findCourses) {
        coursesByTeacher = findCourses.sessionYear.flatMap(department =>
            department.courses
                .filter(course => course.teacher_email === req.user.email)
                .map(course => ({
                    year_semester: department.year_semester,
                    course_name: course.course_name,
                }))
        );
    }else{
        coursesByTeacher = null;
    }
    res.render('teacherDashboard/teacher_dashboard', { user: req.user, coursesByTeacher});
});

router.get('/teacher/edit_profile', checkAuthenticatedteacher, async (req, res) => {


    const findCourses = await Course.findOne({ department: req.user.department });


    var coursesByTeacher;
    if (findCourses) {
        coursesByTeacher = findCourses.sessionYear.flatMap(department =>
            department.courses
                .filter(course => course.teacher_email === req.user.email)
                .map(course => ({
                    batch_name: department.batch_name,
                    course_name: course.course_name,
                    course_title: course.course_title
                }))
        );
    } else {
        coursesByTeacher = null;
    }
     res.render('teacherDashboard/edit_teacher_profile', { user: req.user, coursesByTeacher });
});




router.get('/student/dashboard', checkAuthenticatedstudent, (req, res) =>

    res.render('studentDashboard/student_dashboard', { user: req.user })
);




module.exports = router;
