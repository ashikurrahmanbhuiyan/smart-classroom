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
    },
    submissionsDetails: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'students',
            default: null
        }, 
        submissionDate: {
            type: Date,
            default: Date.now
        },
        marks: {
            type: Number,
            default: 0
        },
        feedback: {
            type: String,
            default: ''
        }
    }],
    
});

module.exports = mongoose.model('Assignment', assignmentSchema);