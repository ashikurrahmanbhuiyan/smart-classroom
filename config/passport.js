const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const passport = require('passport');
const User_teacher = require('../models/user_teacher');
const User_student = require('../models/user_student');

module.exports = function (passport) {

    // Teacher
    passport.use(
        'local-teacher',
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User_teacher.findOne({ email });
                if (!user) {
                    console.log('Email not registered');
                    return done(null, false, { message: 'Email not registered' });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    console.log('Password incorrect');
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (err) {
                return done(err);
            }
        })
    );

    // Student
    passport.use(
        'local-student',
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const user = await User_student.findOne({ email });
                if (!user) {
                    console.log('Email not registered');
                    return done(null, false, { message: 'Email not registered' });
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    console.log('Password incorrect');
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (err) {
                console.log('Error');
                return done(err);
            }
        })
    );

    //serialize and deserialize both teacher and student
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            // First, attempt to find the user in the User_teacher collection
            let user = await User_teacher.findById(id);
            if (user) {
                return done(null, user); // If found, return the user
            }

            // If not found in User_teacher, check the User_student collection
            user = await User_student.findById(id);
            if (user) {
                return done(null, user); // If found, return the user
            }

            // If not found in either collection, return an error
            return done(null, false, { message: 'User not found' });
        } catch (err) {
            // Handle any errors
            return done(err);
        }
    });


    

};
