const mongoose = require('mongoose');

const attendenceSheetSchema = new mongoose.Schema({
    // student: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user_student',
    // },
    department: {
        type: String,
        required: true,
    },
    year_semester: {
        type: String,
        required: true,
    },
    course_name: {
        type: String,
        required: true,
    },
    teacher_email: {
        type: String,
        required: true,
    },
    attendance:[{
        Date: {
            type: String,
            required: true,
        },
        Info: {
            type: Object,
            required: true,
        }
    }],

});

module.exports = mongoose.model('attendance_sheet', attendenceSheetSchema);