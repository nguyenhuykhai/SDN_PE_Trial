const express = require('express');
const authRouter = express.Router();
const bodyParser = require('body-parser');
const memberController = require('../controllers/memberController')

authRouter.use(bodyParser.urlencoded({ extended: true }));

// Chuyển tới trang đăng ký
authRouter.get('/register', async function (req, res, next) {
  memberController.regis(req, res)
});

// Xử lý đăng ký
authRouter.post('/register', async function (req, res, next) {
  memberController.handleRegis(req, res, next)
});

// Chuyển tới trang đăng nhập
authRouter.get('/', async function (req, res, next) {
  memberController.login(req, res)
});

// Xử lý đăng nhập
authRouter.post('/', async function(req, res, next) {
  memberController.handleLogin(req, res)
});

// Xử lý đăng xuất
authRouter.get('/logout', async function(req, res, next) {
  memberController.signout(req, res, next)
})

module.exports = authRouter;
