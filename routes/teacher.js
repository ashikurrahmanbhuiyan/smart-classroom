const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { checkNotAuthenticatedteacher } = require('../config/auth');
const User_teacher = require('../models/user_teacher');
const Course = require('../models/course');
const Attendance = require('../models/attendance_model');
const { log } = require('node:console');




// Login Page (restricted for authenticated teacher)
router.get('/login', checkNotAuthenticatedteacher, (req, res) => res.render('teacherAuth/teacher_login'));

// Register Page (restricted for authenticated teacher)
router.get('/register', checkNotAuthenticatedteacher, (req, res) => res.render('teacherAuth/teacher_register'));

// Register Handler
router.post('/register', checkNotAuthenticatedteacher, async (req, res) => {
    const { name, email, department, password, password2 } = req.body;
    let error1, error2, error3;

    if (password.length < 6) {
        return res.render('teacherAuth/teacher_register', { error1: 'Password must be at least 6 characters', name, email });
    }
    if (password !== password2) {
        return res.render('teacherAuth/teacher_register', { error2: 'Passwords does not match', name, email });
    }

    try {
        const existingUser = await User_teacher.findOne({ email });
        if (existingUser) {
            return res.render('teacherAuth/teacher_register', { error3: 'Email already registered', name, email });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User_teacher({ name, email, department, password: hashedPassword });
        await newUser.save();
        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/teacher/login');
    } catch (err) {
        console.error(err);
        res.redirect('/teacher/register');
    }
});

// Login Handler
router.post('/login', checkNotAuthenticatedteacher, (req, res, next) => {
    passport.authenticate('local-teacher', {
        successRedirect: '/teacher/dashboard',
        failureRedirect: '/teacher/login',
        failureFlash: true,
    })(req, res, next);
});

// Logout Handler
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) throw err;
        req.flash('success_msg', 'You are logged out');
        res.redirect('/teacher/login');
    });
});

router.post("/update-name", async (req, res) => {
    const { name, email } = req.body;
    try {
        const userTeacher = await User_teacher.updateOne(
            { email: email },
            { $set: { name } }
        );
        res.redirect('/teacher/edit_profile')
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }
});


// for uploads profile pics

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const course = require('../models/course');
const { console } = require('node:inspector');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/profilePics');
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.svg'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedFileTypes.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post("/update-profile-pic", upload.single("updateProfilePic"), async (req, res) => {
    const { email } = req.body;

    try {
        const pic = await User_teacher.findOne({ email });
        const oldPicture = pic.picture ? `./public/profilePics/${pic.picture}` : null;

        picture = req.file ? req.file.filename : null;
        const validExtensions = ['.jpg', '.jpeg', '.png', '.svg'];
        if (!picture) {
            return res.redirect('/teacher/edit_profile');
        } else {
            const validation = validExtensions.some(ext => picture.toLowerCase().endsWith(ext));
            if (!validation) {
                return res.redirect('/teacher/edit_profile');
            }
        }
        const userTeacher = await User_teacher.updateOne(
            { email: email },
            { $set: { picture: picture } }
        );

        if (oldPicture) {
            fs.unlink(oldPicture, (err) => {
                if (err) {

                } else {

                }
            });
        }

        res.redirect('/teacher/edit_profile');
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }

});


// for updating positon
router.post("/update-position", async (req, res) => {
    const { position, email } = req.body;
    try {
        const userTeacher = await User_teacher.updateOne(
            { email: email },
            { $set: { position } }
        );
        res.redirect('/teacher/edit_profile')
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }
});


// contact section

router.post("/update-contact", async (req, res) => {
    const { contact, email } = req.body;
    try {
        const userTeacher = await User_teacher.updateOne(
            { email: email },
            { $set: { contact } }
        );
        res.redirect('/teacher/edit_profile')
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Failed to update name' });
    }
});


// Educational Qualification

router.post("/update-education", async (req, res) => {
    let { institute, degree, email } = req.body;
    const pro = await User_teacher.findOne({ email: email })
        .then((edu) => {
            if (edu) {
                edu.educations.push({
                    institute: institute,
                    qualification: degree
                });
                edu.save();
            } else {
                const newEdu = new User_teacher({
                    educations: [{
                        institute: institute,
                        qualification: degree
                    }]
                });
                newEdu.save();
            }
        });
    res.redirect('/teacher/edit_profile');
});


router.post("/update-research", async (req, res) => {
    let { research, email } = req.body;
    const pro = await User_teacher.findOne({ email: email })
        .then((interest) => {
            if (interest) {
                interest.researchs.push({
                    research: research

                });
                interest.save();
            } else {
                const newRs = new User_teacher({
                    researchs: [{
                        research: research,
                    }]
                });
                newRs.save();
            }
        });
    res.redirect('/teacher/edit_profile');
});

router.post("/add-course", async (req, res) => {
    const { dept_name, course_name, year, semester, email } = req.body;
    const year_semester = year + " " + semester;
    const user = await User_teacher.findOne({ email: email });

    //add new attendance collection
    const attendance_course = new Attendance({
        department: dept_name,
        year_semester: year_semester,
        course_name: course_name,
        teacher_email: user.email
    });
    attendance_course.save();

    
    //update or add new course collection
    const course = await Course.findOne({ department: dept_name })
        .then((uniqCourse) => {
            if (uniqCourse) {
                const FindYear = uniqCourse.sessionYear.find((d) => d.year_semester === year_semester);
                if (FindYear) {
                    const course = FindYear.courses.push({
                        teacher_email: user.email,
                        course_name: course_name,
                    });

                    uniqCourse.save();
                } else {
                    const course = uniqCourse.sessionYear.push({
                        year_semester: year_semester,
                        courses: [
                            {
                                teacher_email: user.email,
                                course_name: course_name,
                            }
                        ],
                    });
                    uniqCourse.save();
                }
            } else {
                const newCurse = new Course({
                    department: dept_name,
                    sessionYear: [
                        {
                            year_semester: year_semester,
                            courses: [
                                {
                                    teacher_email: user.email,
                                    course_name: course_name,
                                }
                            ],
                        }
                    ]
                });
                newCurse.save();
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ success: false, message: 'Failed to add course' });
        });

    res.redirect('/teacher/dashboard');

});


router.post("/add-schedule", async (req, res) => {
    const { select_day, start_time, end_time, course_name , department,year_semester} = req.body;
    const course = await Course.findOne({ department: department });
    const schedule = course.sessionYear.find((d) => d.year_semester === year_semester).courses.find((c) => c.course_name === course_name).course_schedule;

    const newSchedule = {
        day: select_day,
        start_time: start_time,
        end_time: end_time
    };
    schedule.push(newSchedule);
    course.save();
    res.redirect('/teacher/dashboard');
});


// router.post("/api/user", async (req, res) => {
//     try {
//         const { name, email } = req.body;
//         //const newUser = new User({ name, email });
//         //await newUser.save();
//         res.status(201).json({ message: "User saved successfully", user: name });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });



router.post("/api/schedule", async (req, res) => {
    const { course_name,department,year_semester } = req.body;
    const course = await Course.findOne({ department: department });
    const schedule = course.sessionYear.find((d) => d.year_semester == year_semester).courses.find((c) => c.course_name == course_name).course_schedule;
    res.status(200).json({ schedule: schedule });
});




module.exports = router;
