const attendence_model = require('../models/attendence_model');
const students = require('../models/user_student');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//no need for authentication those post method because it is only accessible by teacher by button click
router.post('/', async(req, res) => {
    try {
        const course_name = req.body.course_name;
        // this is not well done, this need to be change later because data will fetch from enroll collection
        const users = await students.find({ });
<<<<<<< HEAD
        res.render('attendance_sheet', { users: users,course_name: course_name });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('attendance_sheet', { users: [], course_name: course_name });
=======
        res.render('attendance/attendance_sheet', { users: users });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('attendance/attendance_sheet',{users:[]});
>>>>>>> refs/remotes/origin/main
    }
});


router.post('/save',async (req,res)=>{
    const attendanceArray = req.body.attendanceArray;    
    const attendanceArrayJSON = JSON.parse(attendanceArray);
    console.log(req.body)


    const date = req.body.date;
    const course_name = req.body.course_name;
    // this is not well done, this need to be change later because data will fetch from enroll collection
    const users = await students.find({});
    const attendances = await attendence_model.find({ course_name: course_name });

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
        res.render('attendance_sheet_all', { users: users, attendances: attendances, course_name: course_name });
    } catch (error) {
        try {
            // this is not well done, this need to be change later because data will fetch from enroll collection
            const users = await students.find({});
<<<<<<< HEAD
            res.render('attendance_sheet', { users: users,problem:"Cann't update attendence",course_name:course_name });
        } catch (error) {
            console.error("Error fetching data:", error);
            res.render('attendance_sheet', { users: [], course_name: "" });
=======
            res.render('attendance/attendance_sheet', { users: users,problem:"Cann't update attendence" });
        } catch (error) {
            console.error("Error fetching data:", error);
            res.render('attendance/attendance_sheet', { users: [] });
>>>>>>> refs/remotes/origin/main
        }
    }

});

router.post('/all', async(req, res) => {
    try {
        // this is not well done, this need to be change later because data will fetch from enroll collection
        const users = await students.find({});
        const course_name = req.body.course_name;
        const attendances = await attendence_model.find({course_name: course_name});
<<<<<<< HEAD
        res.render('attendance_sheet_all', { users: users, attendances: attendances, course_name: course_name });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('attendance_sheet', { users: [], attendances: [], course_name: course_name });
=======
        res.render('attendance/attendance_sheet_all', { users: users , attendances: attendances});
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('attendance/attendance_sheet', { users: [] ,attendances: []});
>>>>>>> refs/remotes/origin/main
    }
});

module.exports = router;