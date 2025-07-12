const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subject:{
        type: String,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    submissions: {
        type: String,
        required: true,
    },
    totalStudents: {
        type: String,
        required: true,
    }
    
    
});

module.exports = mongoose.model('Assignment', assignmentSchema);