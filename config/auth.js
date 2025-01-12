function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // res.redirect('/users/login');
    res.redirect('/teacher/login');
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard'); // Redirect to a protected page
    }
    next();
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
};
