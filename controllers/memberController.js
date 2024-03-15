const Members = require('../models/members')
const Course = require('../models/courses')
const bcrypt = require('bcrypt')
const passport = require('passport');
const jwt = require('jsonwebtoken');

class MemberController {
    async regis(req, res) {
        res.render('register', { message: 'Trang đăng ký' });
    }
    async handleRegis(req, res, next) {
        const { username, password } = req.body;
        let error = undefined;
        if (!username || !password) {
            error = 'Nhập toàn bộ field';
        }
        if (password.length < 6) {
            error = 'Password ít nhất 6 ký tự';
        }
        if (error !== undefined) {
            res.render('register', {
                error, username, password
            });
        } else {
            await Members.findOne({ username: username }).then(user => {
                if (user) {
                    error = 'Tài khoản đã tồn tại';
                    res.render('register', {
                        error, username, password
                    });
                } else {
                    const newMember = new Members({ username, password })
                    //Hash password
                    bcrypt.hash(newMember.password, 10, function (err, hash) {
                        if (err) throw err;
                        newMember.password = hash;
                        newMember.save()
                            .then(user => {
                                const token = jwt.sign({ _id: user.id, username: user.username }, 'SDN301m', { expiresIn: '1h' });
                                res.cookie('token', token, {maxAge: 900000, httpOnly: true});
                                let data = [];
                                let error = undefined;
                                try {
                                     Course.find().then(courses => {
                                        if (courses) {
                                            data.push(...courses)
                                            res.render('home', { data, error })
                                        } else {
                                            res.render('home', { data, error: 'Lấy danh sách không thành công' })
                                        }
                                    })
                                } catch (error) {
                                    res.render('home', { data, error: 'Lấy danh sách không thành công' })
                                }
                            })
                            .catch(next);
                    })
                }
            })
        }
    }
    async login(req, res) {
        res.render('login', { message: 'Trang đăng nhập' });
    }
    async handleLogin(req, res) {
        passport.authenticate('local', {
            failureRedirect: '/auth',
            failureFlash: true
        })(req, res, async function(err) {
            if (err) {
                res.render('login', { error: 'Đăng nhập không thành công' })
            }
            if (req.user) {
                let user = { _id: req.user._id, username: req.user.username }
                const token = jwt.sign({ _id: user.id, username: user.username }, 'SDN301m');
                res.cookie('token', token, {maxAge: 900000, httpOnly: true});
                res.redirect('/course');
            } else {
                res.render('login', { error: 'Đăng nhập không thành công' })
            }
        });
    }
    async signout(req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.render('login', { message: 'Đăng xuất thành công' });
        })
    }

    // Xử lý Authenticate với POSTMAN
    async handleApiLogin(req, res, next) {
        passport.authenticate('local', {
            failureFlash: true
        })(req, res, async function(err) {
            if (err) {
                res.status(400).json({ error: 'Đăng nhập không thành công' })
            }
            if (req.user) {
                let user = { _id: req.user._id, username: req.user.username }
                const token = jwt.sign({ _id: user.id, username: user.username }, 'SDN301m');
                res.cookie('token', token, {maxAge: 900000, httpOnly: true});
                res.status(200).json({ user, token });
            } else {
                res.status(400).json({ error: 'Đăng nhập không thành công' })
            }
        }); 
    }

    async handleApiSignout(req, res, next) {
        req.logout(function (err) {
            if (err) { return next(err); }
            res.status(200).json({ message: 'Đăng xuất thành công' });
        })
    }
}

module.exports = new MemberController