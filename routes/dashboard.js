var express = require('express');
var dashboardRouter = express.Router();
const bodyParser = require('body-parser');
const courseController = require('../controllers/courseController')
const memberController = require('../controllers/memberController')
const { jwtDecode, ensureAuthenticated } = require('../config/auth')

dashboardRouter.use(bodyParser.urlencoded({ extended: true }));

// Xử lý REST API với Course
dashboardRouter.get('/course', async function (req, res, next) {
    courseController.getApiAll(req, res, next);
});

dashboardRouter.get('/course/:id', async function (req, res, next) {
    courseController.getApiCourseDetail(req, res, next);
});

dashboardRouter.post('/course', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.createApiCourse(req, res, next);
});

dashboardRouter.put('/course/:id', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.editApiCourse(req, res, next);
});

dashboardRouter.delete('/course/:id', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    courseController.deleteApiCourse(req, res, next);
});

// Xử lý Authenticate với POSTMAN
dashboardRouter.post('/auth/login', async function(req, res, next) {
    memberController.handleApiLogin(req, res, next)
})
  
dashboardRouter.get('/auth/logout', ensureAuthenticated, jwtDecode, async function(req, res, next) {
    memberController.handleApiSignout(req, res, next)
});

module.exports = dashboardRouter;