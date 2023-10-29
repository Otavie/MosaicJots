const express = require('express');
const dashboardController = require('../controllers/blog/dashboardController');
const createController = require('../controllers/blog/createController');
const dashboardRouter = express.Router();
const verifyToken = require('../middleware/verifyToken');

dashboardRouter.get('/', verifyToken, dashboardController.getDashboard);
// dashboardRouter.get('/preview', verifyToken, dashboardController.getPreview);
dashboardRouter.get('/edit/:id', verifyToken, dashboardController.getEditBlog);
dashboardRouter.post('/edit/:id', verifyToken, dashboardController.postEditBlog);
dashboardRouter.get('/delete/:id', verifyToken, dashboardController.getDeleteBlog);
dashboardRouter.post('/delete/:id', verifyToken, dashboardController.postDeleteBlog);
dashboardRouter.get('/create', verifyToken, createController.getCreate);
dashboardRouter.post('/create', verifyToken, createController.postCreate);

module.exports = dashboardRouter;