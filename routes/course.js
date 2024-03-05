var express = require('express');
var courseRouter = express.Router();
const bodyParser = require('body-parser');
const courseController = require('../controllers/courseController')
const { jwtDecode, ensureAuthenticated } = require('../config/auth')

courseRouter.use(bodyParser.urlencoded({ extended: true }));

// Chuyển tới trang chủ
courseRouter.get('/', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.getAll(req, res, next);
});

courseRouter.get('/course/:id', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.getCourseDetail(req, res, next);
});

courseRouter.post('/course/:id/edit', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.editCourse(req, res, next);
});

courseRouter.get('/course/:id/delete', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.deleteCourse(req, res, next);
});

module.exports = courseRouter;