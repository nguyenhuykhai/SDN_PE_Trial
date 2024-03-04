var express = require('express');
var courseRouter = express.Router();
const bodyParser = require('body-parser');
const courseControlle = require('../controllers/courseController')
const { jwtDecode, ensureAuthenticated } = require('../config/auth')

courseRouter.use(bodyParser.urlencoded({ extended: true }));

// Chuyển tới trang chủ
courseRouter.get('/', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseControlle.getAll(req, res, next);
});

courseRouter.get('/course/:id', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseControlle.getCourseDetail(req, res, next);
});

courseRouter.post('/course/:id/edit', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseControlle.editCourse(req, res, next);
});

module.exports = courseRouter;