function checkAuthenticatedteacher(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/teacher/login');
}

function checkNotAuthenticatedteacher(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/teacher/dashboard'); // Redirect to a protected page
    }
    next();
}

function checkAuthenticatedstudent(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/student/login');
}

function checkNotAuthenticatedstudent(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/student/dashboard'); // Redirect to a protected page
    }
    next();
}

module.exports = {
    checkAuthenticatedteacher,
    checkNotAuthenticatedteacher,
    checkAuthenticatedstudent,
    checkNotAuthenticatedstudent,
};
