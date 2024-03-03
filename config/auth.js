const jwt = require('jsonwebtoken')

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
        console.log("BODY: ", req.body.token);
        if (req.body && req.body.token) {
            jwt.verify(req.body.token.split(' '), 'SDN301m', function(err, decode) {
                if (err) req.user.token = undefined;
                req.user.token = decode;
                next();
            });
        } else {
            req.user.token = undefined;
            next()
        }
    }
}
