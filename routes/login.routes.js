const express = require('express')
const loginRouter = express.Router();
const loginController = require('../controllers/auth/loginControllers');
const trimLoginInput = require('../middleware/trimLoginInput');

loginRouter.get('/', loginController.getLogin);
loginRouter.post('/', trimLoginInput, loginController.postLogin);

module.exports = loginRouter;