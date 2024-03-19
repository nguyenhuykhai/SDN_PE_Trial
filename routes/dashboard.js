var express = require('express');
var dashboardRouter = express.Router();
const bodyParser = require('body-parser');
const dashboardController = require('../controllers/dashboardController')
const { jwtDecode, ensureAuthenticated } = require('../config/auth')

dashboardRouter.use(bodyParser.urlencoded({ extended: true }));

// Display dashboard view
dashboardRouter.get('/', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    dashboardController.getAll(req, res, next);
});

dashboardRouter.post('/', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    dashboardController.createItem(req, res, next);
})

dashboardRouter.get('/create', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    res.render('dashboardForm');
})

dashboardRouter.get('/:id', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    dashboardController.getDetail(req, res, next);
});

dashboardRouter.post('/:id/edit', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    dashboardController.editItem(req, res, next);
});

dashboardRouter.get('/:id/delete', ensureAuthenticated, jwtDecode, async function (req, res, next) {
    dashboardController.deleteItem(req, res, next);
});

module.exports = dashboardRouter;