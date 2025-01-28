const express = require('express');
const router = express.Router();
const { checkAuthenticatedteacher } = require('../config/auth');
const { checkAuthenticatedstudent } = require('../config/auth');
const { authenticate } = require('passport');
const Course = require('../models/course');
const Teacher = require('../models/user_teacher');

// Home Page (public)
router.get('/', (req, res) => res.redirect('/teacher/login'));




// teacher dashboard
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
    } else {
        coursesByTeacher = null;
    }
    res.render('teacherDashboard/teacher_dashboard', { user: req.user, coursesByTeacher });
});




// teacher edit profile
router.get('/teacher/edit_profile', checkAuthenticatedteacher, async (req, res) => {
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
    } else {
        coursesByTeacher = null;
    }
    res.render('teacherDashboard/edit_teacher_profile', { user: req.user, coursesByTeacher });
});





// student dashboard



router.get('/student/dashboard', checkAuthenticatedstudent, async(req, res) =>{


    const findCourses = await Course.findOne({ department: req.user.department });

    const semester = req.user.year_semester;

    var coursesByTeacher = [];
    if (findCourses) {
       for(d of findCourses.departments){
            if(d.year_semester === semester){
                for(let course of d.courses){
                    const teacher = await Teacher.findOne({ email :  course.teacher_email});
                    coursesByTeacher.push({
                        teacher_email : course.teacher_email,
                        course_name : course.course_name,
                        year_semester : d.year_semester,
                        teacher : teacher.name,
                        teacher_picture : teacher.picture
                    });
                } 
            }
        };
    } else {
        coursesByTeacher = null;
    }
    
    res.render('studentDashboard/student_dashboard', { student_user: req.user, admmited_courses : coursesByTeacher })
});




module.exports = router;
