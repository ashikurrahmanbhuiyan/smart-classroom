const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture :{
        type : String
    },
    position : {
        type : String
    },
    date: {
        type: Date,
        default: Date.now,
    },
    
});

module.exports = mongoose.model('teacher', teacherSchema);
