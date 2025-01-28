const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    student_id:{
        type: String,
        require: true,
        unique:true,
    },
    department : {
        type : String,
        required : true
    },
    batch : {
        type : String,
        required : true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    
});

module.exports = mongoose.model('student', studentSchema);
