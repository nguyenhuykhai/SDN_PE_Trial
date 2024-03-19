var express = require('express');
var sectionRouter = express.Router();
const bodyParser = require('body-parser');
const sectionController = require('../controllers/sectionController')
const { jwtDecode } = require('../config/auth')

sectionRouter.use(bodyParser.urlencoded({ extended: true }));

// Chuyển tới trang chủ
// sectionRouter.get('/', jwtDecode, async function (req, res, next) {
//     courseControlle.getAll(req, res, next);
// });

sectionRouter.post('/', jwtDecode, async function (req, res, next) {
    sectionController.createSection(req, res, next);
});

sectionRouter.post('/:id/edit', jwtDecode, async function (req, res, next) {
    sectionController.editSection(req, res, next);
});

sectionRouter.get('/:id/delete', jwtDecode, async function (req, res, next) {
    sectionController.deleteSection(req, res, next);
});

module.exports = sectionRouter;