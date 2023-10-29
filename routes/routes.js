const express = require('express');
const router = express.Router();

const blogRouter = require('./blog.routes');
const indexRouter = require('./index.routes');
const loginRouter = require('./login.routes');
const signupRouter = require('./signup.routes');
const logoutRouter = require('./logout.routes');
const dashboardRouter = require('./dashboard.routes');

router.use('/', indexRouter);
router.use('/login', loginRouter);
router.use('/signup', signupRouter);
router.use('/logout', logoutRouter);
router.use('/dashboard', dashboardRouter);
router.use('/blog', blogRouter);

module.exports = router;