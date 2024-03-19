var express = require('express');
var apiRouter = express.Router();
const bodyParser = require('body-parser');
const courseController = require('../controllers/courseController')
const memberController = require('../controllers/memberController')
const { jwtDecode, ensureAuthenticated } = require('../config/auth')

apiRouter.use(bodyParser.urlencoded({ extended: true }));

// Xử lý REST API với Course
apiRouter.get('/course', async function (req, res, next) {
    courseController.getApiAll(req, res, next);
});

apiRouter.get('/course/:id', async function (req, res, next) {
    courseController.getApiCourseDetail(req, res, next);
});

apiRouter.post('/course', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.createApiCourse(req, res, next);
});

apiRouter.put('/course/:id', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.editApiCourse(req, res, next);
});

apiRouter.delete('/course/:id', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.deleteApiCourse(req, res, next);
});

// Xử lý Authenticate với POSTMAN
apiRouter.post('/auth/login', async function(req, res, next) {
    memberController.handleApiLogin(req, res, next)
})
  
apiRouter.get('/auth/logout', ensureAuthenticated, jwtDecode, async function(req, res, next) {
    memberController.handleApiSignout(req, res, next)
});

module.exports = apiRouter;