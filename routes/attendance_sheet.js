const attendence = require('../models/attendence_model');
const students = require('../models/user_student');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//connect to mongodb
const db = mongoose.connection;



router.get('/all', async(req, res) => {
    try {
        // this is not well done, this need to be change later
        const users = await students.find({ });
        res.render('attendance_sheet', { users: users });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render('attendance_sheet');
    }
});

router.post('/all',async (req,res)=>{
    
});

module.exports = router;