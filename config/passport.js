const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const Members = require('../models/members');
const jwt = require('jsonwebtoken');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
            //Match user
            Members.findOne({ username: username })
                .then(member => {
                    if (!member) {
                        return done(null, false, { message: 'Tài khoản không tồn tại' });
                    }
                    //Match password
                    bcrypt.compare(password, member.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, member);
                        }
                        else {
                            return done(null, false, { message: 'Sai mật khẩu' });
                        }
                    })
                })
                .catch(err => console.log(err));
        })
    )
    passport.serializeUser(function (member, done) {
        process.nextTick(function () {
            done(null, member.id);
        });
    });

    passport.deserializeUser(function (member, done) {
        process.nextTick(function () {
            return done(null, member);
        });
    });
}