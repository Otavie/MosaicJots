const express = require('express');
const blogController = require('../controllers/blog/blogController');
const blogRouter = express.Router();

blogRouter.get('/:id', blogController.getBlog);

module.exports = blogRouter;