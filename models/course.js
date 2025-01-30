const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    department : {
        type : String,
        required : true
    },
    sessionYear : [
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
                    },
                    course_schedule : [
                        {
                            day : {
                                type : String,
                                required : true
                            },
                            start_time : {
                                type : String,
                            },
                            end_time : {
                                type : String,
                            }
                        }
                    ]
                }
            ]
        }
    ]
});

module.exports = mongoose.model('course', courseSchema);
