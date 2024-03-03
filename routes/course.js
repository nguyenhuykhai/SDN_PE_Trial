var express = require('express');
var courseRouter = express.Router();
const bodyParser = require('body-parser');
const courseControlle = require('../controllers/courseController')
const { jwtRequired, ensureAuthenticated } = require('../config/auth')

courseRouter.use(bodyParser.urlencoded({ extended: true }));

// Chuyển tới trang chủ
courseRouter.get('/', ensureAuthenticated, async function (req, res, next) {
    courseControlle.getAll(req, res, next);
});

module.exports = courseRouter;