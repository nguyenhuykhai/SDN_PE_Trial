const Members = require('../models/members')
const Course = require('../models/courses')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Joi = require('joi') 

class MemberController {
    async regis(req, res) {
        res.render('register', { message: 'Register Page' });
    }
    async handleRegis(req, res, next) {
        const { username, password } = req.body;
        const JoiSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required().min(6)
        }).options({ abortEarly: false });

        const { error } = JoiSchema.validate({ username, password });

        if (error) {
            res.render('register', { error: 'Username or password invalid', username, password });
        } else {
            await Members.findOne({ username: username }).then(user => {
                if (user) {
                    res.render('register', { error: 'Account already exists', username, password });
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
                                res.redirect('/course');
                            })
                            .catch(next);
                    })
                }
            })
        }
    }

    async login(req, res) {
        res.render('login', { message: 'Login Page' });
    }

    async handleLogin(req, res) {
        let { username, password } = req.body;
        //Match user
        try {
            Members.findOne({ username: username }).then(member => {
                if (!member) {
                    res.render('login', { error: 'Login failed' })
                } else {
                    //Match password
                    bcrypt.compare(password, member.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            let user = { _id: member._id, username: member.username }
                            const token = jwt.sign({ _id: user.id, username: user.username }, 'SDN301m');
                            res.cookie('token', token, { maxAge: 900000, httpOnly: true });
                            res.redirect('/course');
                        } else {
                            res.render('login', { error: 'Incorrect password' })
                        }
                    })
                }
            })
        } catch (error) {
            res.render('login', { error: 'Incorrect password' })
        }
    }

    async signout(req, res, next) {
        // Remove token from cookie
        res.clearCookie('token');
        res.render('login', { message: 'Logout successfull' });
    }

    // Xử lý Authenticate với POSTMAN
    async handleApiLogin(req, res, next) {
        let { username, password } = req.body;
        //Match user
        try {
            Members.findOne({ username: username }).then(member => {
                if (!member) {
                    res.status(4000).json({ error: 'Login failed' })
                } else {
                    //Match password
                    bcrypt.compare(password, member.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            let user = { _id: member._id, username: member.username }
                            // Convert Object to String
                            const userId = user._id.toString();
                            const token = jwt.sign({ _id: user.id, username: user.username }, 'SDN301m');
                            res.cookie('token', token, { maxAge: 900000, httpOnly: true });
                            res.status(200).json({ id: userId, username: user.username , token });
                        } else {
                            res.status(400).json({ error: 'Incorrect password' })
                        }
                    })
                }
            })
        } catch (error) {
            res.status(400).json({ error: 'Incorrect password' })
        }
    }

    // Handle API resigter
    async handleApiRegis(req, res, next) {
        const { username, password } = req.body;
        const JoiSchema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required().min(6)
        }).options({ abortEarly: false });

        const { error } = JoiSchema.validate({ username, password });

        if (error) {
            res.status(400).json({ error: 'Username or password invalid' });
        } else {
            await Members.findOne({ username: username }).then(user => {
                if (user) {
                    res.status(400).json({ error: 'Account already exists' });
                } else {
                    const newMember = new Members({ username, password })
                    //Hash password
                    bcrypt.hash(newMember.password, 10, function (err, hash) {
                        if (err) throw err;
                        newMember.password = hash;
                        newMember.save()
                            .then(user => {
                                const token = jwt.sign({ _id: user.id, username: user.username }, 'SDN301m', { expiresIn: '1h' });
                                res.status(200).json({ id: user.id, username: user.username, token });
                            })
                            .catch(next);
                    })
                }
            })
        }
    }

    async handleApiSignout(req, res, next) {
        // Remove token from cookie
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successfull' });
    }
}

module.exports = new MemberController