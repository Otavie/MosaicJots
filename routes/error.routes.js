const express = require('express');
const errorRouter = express.Router();

errorRouter.get('/error', (req, res) => {
    res.status(500).render('error', {
        message: error
    })
})

module.exports = errorRouter;