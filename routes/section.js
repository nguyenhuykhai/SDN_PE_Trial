var express = require('express');
var sectionRouter = express.Router();
const bodyParser = require('body-parser');
const sectionController = require('../controllers/sectionController')
const { jwtDecode, ensureAuthenticated } = require('../config/auth')

sectionRouter.use(bodyParser.urlencoded({ extended: true }));

// Chuyển tới trang chủ
// sectionRouter.get('/', ensureAuthenticated, jwtDecode, async function (req, res, next) {
//     courseControlle.getAll(req, res, next);
// });

// sectionRouter.get('/course/:id', ensureAuthenticated, jwtDecode, async function (req, res, next) {
//     courseControlle.getCourseDetail(req, res, next);
// });

sectionRouter.post('/section/:id/edit', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    sectionController.editSection(req, res, next);
});

sectionRouter.get('/section/:id/delete', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    sectionController.deleteSection(req, res, next);
});

module.exports = sectionRouter;