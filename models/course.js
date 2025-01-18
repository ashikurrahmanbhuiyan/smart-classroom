const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    department : {
        type : String,
    },
    departments : [
        {
            batch_name : {
                type : String,
                required : true
            },
            
            courses : [
                {
                    teacher_email :{
                        type : String,
                        required : true
                    },
                    course_title : {
                        type : String
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
