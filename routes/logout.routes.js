require('dotenv').config();
const express = require('express');
const logoutRouter = express.Router();

logoutRouter.get('/', (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie('token');
        res.status(200).redirect('/login');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error Gte!');
    }
})

module.exports = logoutRouter;