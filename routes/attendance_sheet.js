const { checkAuthenticatedteacher } = require('../config/auth');
const attendence_model = require('../models/attendance_model');
const students = require('../models/user_student');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get('/', checkAuthenticatedteacher, async (req, res) => {
    try {
        const course_name = req.query.course_name;
        // this is not well done, this need to be change later because data will fetch from enroll collection
        const users = await students.find({});
        res.render('course_pages/attendance/attendance_sheet', { users: users, course_name: course_name });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('course_pages/attendance/attendance_sheet', { users: [], course_name: "" });
    }
});

// router.post('/',checkAuthenticatedteacher, async(req, res) => {
//     try {
//         const course_name = req.body.course_name;
//         // this is not well done, this need to be change later because data will fetch from enroll collection
//         const users = await students.find({ });
//         res.render('course_pages/attendance/attendance_sheet', { users: users, course_name: course_name });
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.render('course_pages/attendance/attendance_sheet',{users:[], course_name: ""});
//     }
// });


router.post('/save', async (req, res) => {
    const attendanceArray = req.body.attendanceArray;
    const attendanceArrayJSON = JSON.parse(attendanceArray);


    const date = req.body.date;
    const course_name = req.body.course_name;

    try {
        let UpdateAttendance = await attendence_model.findOne({ course_name: course_name });
        if (UpdateAttendance) {
            UpdateAttendance.attendance.push({
                Date: date,
                Info: attendanceArrayJSON
            });
            await UpdateAttendance.save(); // Ensure save errors are caught
        } else {
            const newAttendence = new attendence_model({
                attendance: [{
                    Date: date,
                    Info: attendanceArrayJSON
                }]
            });
            await newAttendence.save(); // Ensure save errors are caught
        }

        // this is not well done, this need to be change later because data will fetch from enroll collection
        const users = await students.find({});
        const attendances = await attendence_model.find({ course_name: course_name });
        res.render('course_pages/attendance/attendance_sheet_all', { page: 'attendance_sheet_all', users: users, attendances: attendances, course_name: course_name });
    } catch (error) {
        try {
            // this is not well done, this need to be change later because data will fetch from enroll collection
            const users = await students.find({});
            res.render('course_pages/attendance/attendance_sheet_all', { page: 'attendance_sheet_all', users: users, problem: "Cann't update attendence", course_name: course_name });
        } catch (error) {
            console.error("Error fetching data:", error);
            res.render('course_pages/attendance/attendance_sheet_all', { page: 'attendance_sheet_all', users: [],problem: error, course_name: "" });
        }
    }

});

// router.get('/all', async (req, res) => {
//     res.redirect('/teacher/dashboard');
// });


//this method is not used because  we are using get method to fetch all attendence
// router.post('/all', async(req, res) => {
//     try {
//         // this is not well done, this need to be change later because data will fetch from enroll collection
//         const users = await students.find({});
//         const course_name = req.body.course_name;
//         const attendances = await attendence_model.find({course_name: course_name});
//         res.render('course_pages/attendance/attendance_sheet_all', { page: 'attendance_sheet_all', users: users , attendances: attendances, course_name: course_name});
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.redirect('/teacher/dashboard');
//     }
// });

router.get('/all',checkAuthenticatedteacher, async (req, res) => {
    try {
        // this is not well done, this need to be change later because data will fetch from enroll collection
        const users = await students.find({});
        const course_name = req.query.course_name;
        const attendances = await attendence_model.find({ course_name: course_name });
        res.render('course_pages/attendance/attendance_sheet_all', { page: 'attendance_sheet_all', users: users, attendances: attendances, course_name: course_name });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.redirect('/teacher/dashboard');
    }
});


module.exports = router;