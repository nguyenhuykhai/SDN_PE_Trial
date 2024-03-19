var express = require('express');
var courseRouter = express.Router();
const bodyParser = require('body-parser');
const courseController = require('../controllers/courseController')
const { jwtDecode } = require('../config/auth')

courseRouter.use(bodyParser.urlencoded({ extended: true }));

// Chuyển tới trang chủ
courseRouter.get('/', jwtDecode, async function (req, res, next) {
    courseController.getAll(req, res, next);
});

courseRouter.post('/', jwtDecode, async function (req, res, next) {
    courseController.createCourse(req, res, next);
})

courseRouter.get('/create', jwtDecode, async function (req, res, next) {
    res.render('createCourse');
})

courseRouter.get('/:id', jwtDecode, async function (req, res, next) {
    courseController.getCourseDetail(req, res, next);
});

courseRouter.post('/:id/edit', jwtDecode, async function (req, res, next) {
    courseController.editCourse(req, res, next);
});

courseRouter.get('/:id/delete', jwtDecode, async function (req, res, next) {
    courseController.deleteCourse(req, res, next);
});

module.exports = courseRouter;