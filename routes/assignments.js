const express = require('express');
const { checkAuthenticatedteacher } = require('../config/auth');
const Assignment = require('../models/assignments_model'); // Assuming you have a model for assignments
const router = express.Router();


router.get('/', async (req, res) => {
    // console.log(req.user.name);
    course_name = req.query.course_name;
    try {
        res.render('course_pages/assignments', { page: 'assignments', course_name: course_name, });
    } catch (error) {
        console.error('Error rendering assignments page:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/add-assignment', checkAuthenticatedteacher, (req, res) => {
    const { title, subject, description, dueDate } = req.body;
    const newAssignment =  new Assignment({
        title,
        subject,
        description,
        dueDate,
        status: 'active',
        submissions: 0,
        totalStudents: 30 // Mock total, later need to change this to dynamic value
    });
    newAssignment.save()
        .then(() => {
            res.status(201).json({ success: true });
        })
        .catch(err => {
            console.error('Error adding assignment:', err);
            return res.status(500).json({ message: 'Error adding assignment' });
        });
});


router.get('/get-assignments', async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.status(200).json(assignments);
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).json({ message: 'Error fetching assignments' });
    }
});


module.exports = router;