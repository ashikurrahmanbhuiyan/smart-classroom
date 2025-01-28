const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    department : {
        type : String,
        required : true
    },
    departments : [
        {
            year_semester : {
                type : String,
            },
            
            courses : [
                {
                    teacher_email :{
                        type : String,
                        required : true
                    },
                    course_name : {
                        type : String,
                        required : true
                    }
                }
            ]
        }
    ]
});

module.exports = mongoose.model('course', courseSchema);
