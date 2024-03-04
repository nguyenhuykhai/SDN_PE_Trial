module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'Vui lòng đăng nhập');
        console.log('Not pass passport authenticate');
        res.render('login', { error: 'Vui lòng đăng nhập' });
    },
    jwtDecode: function (req, res, next) {
        let token = req.cookies.token;
        if (token) {
            next();
        } else {
            res.render('login', { error: 'Vui lòng đăng nhập' });
        }
    }
}
