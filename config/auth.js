const jwt = require('jsonwebtoken')

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user) {
                return next();
            } else {
                req.flash('error', 'Cannot find JWT token');
                console.log('Cannot find JWT token')
                res.render('login', { error: 'Phiên đăng nhập hết hạn' });
            }
        }
        req.flash('error', 'Please log in first!');
        console.log('Not pass passport authenticate');
        res.render('login', { error: 'Vui lòng đăng nhập' });
    },
    jwtDecode: function (req, res, next) {
        if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
            jwt.verify(req.headers.authorization.split(' '), 'SDN301m', function(err, decode) {
                if (err) req.user = undefined;
                req.user = decode;
                next();
            });
        } else {
            req.user = undefined;
            next()
        }
    }
}
