var express = require('express');
var dashboardRouter = express.Router();
const bodyParser = require('body-parser');
const dashboardController = require('../controllers/dashboardController')
const { jwtDecode } = require('../config/auth')

dashboardRouter.use(bodyParser.urlencoded({ extended: true }));

// Display dashboard view
dashboardRouter.get('/', jwtDecode, async function (req, res, next) {
    dashboardController.getAll(req, res, next);
});

dashboardRouter.post('/', jwtDecode, async function (req, res, next) {
    dashboardController.createItem(req, res, next);
})

dashboardRouter.post('/search', async function (req, res, next) {
    dashboardController.searchItem(req, res, next);
})

dashboardRouter.get('/create', jwtDecode, async function (req, res, next) {
    res.render('dashboardForm');
})

dashboardRouter.get('/:id', jwtDecode, async function (req, res, next) {
    dashboardController.getDetail(req, res, next);
});

dashboardRouter.post('/:id/edit', jwtDecode, async function (req, res, next) {
    dashboardController.editItem(req, res, next);
});

dashboardRouter.get('/:id/delete', jwtDecode, async function (req, res, next) {
    dashboardController.deleteItem(req, res, next);
});

module.exports = dashboardRouter;