const express = require('express');
const router = express.Router();
const { checkAuthenticatedteacher } = require('../config/auth');
const { checkAuthenticatedstudent } = require('../config/auth');
const { authenticate } = require('passport');
const Course = require('../models/course');
const Teacher = require('../models/user_teacher');
const Student = require('../models/user_student');
const course = require('../models/course');
// Home Page (public)
router.get('/', (req, res) => res.redirect('/teacher/login'));


// teacher dashboard
router.get('/teacher/dashboard', checkAuthenticatedteacher, async (req, res) => {
    const findCourses = await Course.find();
    var coursesByTeacher;
    if(findCourses.length > 0){
    coursesByTeacher = findCourses.flatMap(course =>
        course.sessionYear.flatMap(department =>
            department.courses
                .filter(c => c.teacher_email === req.user.email)
                .map(c => ({
                    department: course.department,
                    year_semester: department.year_semester,
                    course_name: c.course_name,
                    schedule: c.course_schedule,
                }))
        )
    );
    }else{
        coursesByTeacher = null;
    }

    const today = new Date().toLocaleString('en-us', { weekday: 'long' });
    let todayClass;
    if (findCourses.length > 0) {
        todayClass = findCourses.flatMap(course =>
            course.sessionYear.flatMap(department =>
                department.courses
                    .filter(c => c.teacher_email === req.user.email && c.course_schedule.some(s => s.day === today))
                    .map(c => ({
                        department: course.department,
                        year_semester: department.year_semester,
                        course_name: c.course_name,
                        start_time: c.course_schedule.find(s => s.day == today).start_time,
                        end_time: c.course_schedule.find(s => s.day == today).end_time,
                    }))
            )
        );
    } else {
        todayClass = null;
    }
    res.render('teacherDashboard/teacher_dashboard', { user: req.user, coursesByTeacher,today, todayClass });
});




// teacher edit profile
router.get('/teacher/edit_profile', checkAuthenticatedteacher, async (req, res) => {
    const findCourses = await Course.find();
    var coursesByTeacher;
    if(findCourses.length > 0){
    coursesByTeacher = findCourses.flatMap(course =>
        course.sessionYear.flatMap(department =>
            department.courses
                .filter(c => c.teacher_email === req.user.email)
                .map(c => ({
                    year_semester: department.year_semester,
                    course_name: c.course_name,
                }))
        )
    );
    }else{
        coursesByTeacher = null;
    }

    


    res.render('teacherDashboard/edit_teacher_profile', { user: req.user, coursesByTeacher});
});





// student dashboard


router.get('/student/dashboard', checkAuthenticatedstudent, async(req, res) =>{


    const findCourses = await Course.findOne({ department: req.user.department });

    const semester = req.user.year_semester;

    var coursesByTeacher = [];
    var year;
    if (findCourses) {
       for(let d of findCourses.sessionYear){
            if(d.year_semester === semester){
                year = d.year_semester;
                for(let course of d.courses){
                    const teacher = await Teacher.findOne({ email :  course.teacher_email});
                    coursesByTeacher.push({
                        teacher_email : course.teacher_email,
                        course_name : course.course_name,
                        teacher_name : teacher.name,
                    });
                } 
            }
        };
    } else {
        coursesByTeacher = null;
        year = null;
    }
    
    res.render('studentDashboard/student_dashboard', { student_user: req.user, year, available_courses : coursesByTeacher })
});

// Course Enrollment
router.post('/student/enroll', async(req, res, next) => {
    const {student_email, course} = req.body;
    try {
        const student = await Student.findOne({ email: student_email});
        if (!student) {
            console.log("Student not found.");
            return;
        }
        const parsedCourse = JSON.parse(course);
        const newCourse = {
            teacher_email: parsedCourse.teacher_email,
            course_name: parsedCourse.course_name,
            teacher_name: parsedCourse.teacher_name
        };
        student.enrolled_courses.push(newCourse); 
        await student.save(); 
    } catch (err) {
        console.error("Error adding course:", err);
    }
    res.redirect('/student/dashboard');
});



module.exports = router;
