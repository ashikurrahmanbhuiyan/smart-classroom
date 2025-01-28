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
                required : true
            },
            
            courses : [
                {
                    teacher_email :{
                        type : String,
                        required : true
                    },
                    // course_title : {
                    //     type : String
                    // }, 
                    course_name : {
                        type : String,
                        required : true
                    },
                    // course_schedule : [
                    //     {
                    //         day : {
                    //             type : String,
                    //             required : true
                    //         },
                    //         start_time : {
                    //             type : String,
                    //             required : true
                    //         },
                    //         end_time : {
                    //             type : String,
                    //             required : true 
                    //         }
                    //     }
                    // ]
                }
            ]
        }
    ]
});

module.exports = mongoose.model('course', courseSchema);
