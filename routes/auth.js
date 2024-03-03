var express = require('express');
var authRouter = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const memberContrroller = require('../controllers/memberController')

dotenv.config();
const Members = require('../models/members');


authRouter.use(bodyParser.urlencoded({ extended: true }));

// Chuyển tới trang đăng ký
authRouter.get('/register', async function (req, res, next) {
  memberContrroller.regis(req, res)
});

// Xử lý đăng ký
authRouter.post('/register', async function (req, res, next) {
  memberContrroller.handleRegis(req, res)
});

// Chuyển tới trang đăng nhập
authRouter.get('/', async function (req, res, next) {
  memberContrroller.login(req, res)
});

// Xử lý đăng nhập
authRouter.post('/', async function(req, res, next) {
  memberContrroller.handleLogin(req, res)
});

// Xử lý đăng ký
authRouter.post('/register', async function (req, res, next) {
  try {
    // Kiểm tra tài khoản có tồn tại chưa
    const foundUser = await Members.findOne({ username: req.body.username })
    if (foundUser !== undefined) {
      res.render('login', { message: 'Tài khoản đã tồn tại' })
    } else {
      // Then generate JWT Token
      const newUser = await Members.create({
        username: req.body.username,
        password: req.body.password,
      });

      const token = jwt.sign(
        {
          _id: newUser._id,
          username: req.body.username,
          password: req.body.password
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE, algorithm: 'HS512' }
      );
      res.render('register', { message: 'Đăng ký thành công', token: token })
    }
  } catch (error) {
    res.render('error', { message: error.message });
  }
}



)


module.exports = authRouter;
