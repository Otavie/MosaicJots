const express = require('express')
const signupRouter = express.Router();
const signController = require('../controllers/auth/signupController');
const trimSignupInput = require('../middleware/trimSignupInput')

signupRouter.get('/', signController.getSignup);
signupRouter.post('/', trimSignupInput, signController.postSignup);

module.exports = signupRouter;