const attendence_model = require('../models/attendence_model');
const students = require('../models/user_student');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async(req, res) => {
    try {
        // this is not well done, this need to be change later because data will fetch from enroll collection
        const users = await students.find({ });
        res.render('attendance_sheet', { users: users });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('attendance_sheet',{users:[]});
    }
});

router.post('/',async (req,res)=>{
    const attendanceArray = req.body.attendanceArray;    

    //loop attendanceArray
    //for each student in attendanceArray
    const attendanceArrayJSON = JSON.parse(attendanceArray);



    const date = req.body.date;
    const courseName = "DBMS";
    //find course name in course collection and push new attendance
    // try {
    //     const course1 = await attendence_model.findOne({ course_name: courseName })
    //         .then((UpdateAttendance) => {
    //             if (UpdateAttendance) {
    //                 UpdateAttendance.attendance.push({
    //                     Date: date,
    //                     Info: attendanceArrayJSON
    //                     });
    //                 UpdateAttendance.save();
    //             } else {
    //             const newAttendence = new attendence_model({
    //                 attendance: [{
    //                         Date: date,
    //                         Info: attendanceArrayJSON
    //                     }]
    //                 });
    //                 newAttendence.save();
    //             }
    //         // console.log(UpdateAttendance.attendance[0].Info[0][0]);
    //         res.redirect('/attendance_sheet/all')
    //         });
        
        
    // } catch (error) {
    //     res.redirect('/attendance_sheet');
    // }

    try {
        let UpdateAttendance = await attendence_model.findOne({ course_name: courseName });
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
        res.redirect('/attendance_sheet/all');
    } catch (error) {
        try {
            // this is not well done, this need to be change later because data will fetch from enroll collection
            const users = await students.find({});
            res.render('attendance_sheet', { users: users,problem:"Cann't update attendence" });
        } catch (error) {
            console.error("Error fetching data:", error);
            res.render('attendance_sheet', { users: [] });
        }
    }

});

router.get('/all', async(req, res) => {
    try {
        // this is not well done, this need to be change later because data will fetch from enroll collection
        const users = await students.find({});
        let course_name = "DBMS";
        const attendances = await attendence_model.find({course_name: course_name});
        res.render('attendance_sheet_all', { users: users , attendances: attendances});
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('attendance_sheet', { users: [] ,attendances: []});
    }
});

router.post('/all', async(req, res) => {
});

module.exports = router;