const attendence = require('../models/attendence_model');
const students = require('../models/user_student');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async(req, res) => {
    try {
        // this is not well done, this need to be change later
        const users = await students.find({ });
        res.render('attendance_sheet', { users: users });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('attendance_sheet',{users:[]});
    }
});

router.post('/',async (req,res)=>{
    const attendanceArray = req.body.attendanceArray;
    const date = req.body.date;
    console.log(attendanceArray);
    console.log(date);
    res.redirect('/attendance_sheet/');
});

router.get('/all', async(req, res) => {
    res.render('attendance_sheet_all');
});

module.exports = router;