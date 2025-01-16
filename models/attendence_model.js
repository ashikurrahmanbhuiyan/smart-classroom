const mongoose = require('mongoose');

const attendenceSheetSchema = new mongoose.Schema({
    // student: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user_student',
    // },
    Date: {
        type: Date,
        required: true,
    },
    Info:[{
        Id:{
            type: String,
            required: true,
        },
        Name:{
            type: String,
            required: true,
        },
        Attendance:{
            type: Boolean,
            default: true,
        }
    }]
});

module.exports = mongoose.model('attendance_sheet', attendenceSheetSchema);