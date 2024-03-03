const Members = require('../models/members')
const bcrypt = require('bcrypt')
const passport = require('passport');
class MemberController {
    regis(req, res) {
        res.render('register', { message: 'Trang đăng ký' });
    }
    handleRegis(req, res, next) {
        const { username, password } = req.body;
        let errors = [];
        if (!username || !password) {
            errors.push({ msg: 'Please enter all fields' });
        }
        if (password.lenght < 6) {
            errors.push({ msg: 'Password must be at least 6 characters' });
        }
        if (errors.lenght > 0) {
            res.render('resgister', {
                errors, username, password
            });
        } else {
            Members.findOne({ username: username }).then(user => {
                if (user) {
                    errors.push({ msg: 'Username already exist' });
                    res.render('register', {
                        errors, username, password
                    });
                } else {
                    const newMember = new Members({ username, password })
                };
                //Hash password
                bcrypt.hash(newUser.password, 10, function (err, hash) {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            res.rendirect('/auth/login')
                        })
                        .catch(next);
                })
            })
        }
    }
    login(req, res) {
        res.render('login', { message: 'Trang đăng nhập' });
    }
    handleLogin(req, res) {
        try {
            // Kiểm tra tài khoản có tồn tại chưa
            const foundUser = Members.findOne({ username: req.body.username })
            if (foundUser) {
                const checkPassword = Members.findOne({ username: req.body.username, password: req.body.password })
                if (checkPassword) {
                    res.render('home', { message: 'Đăng nhập thành công', user: checkPassword })
                } else {
                    res.render('login', { message: 'Sai mật khẩu' })
                }
            } else {
                res.render('login', { message: 'Tài khoản không tồn tại' })
            }
        } catch (error) {
            res.render('error', { message: error.message });
        }
    }
}

module.exports = new MemberController