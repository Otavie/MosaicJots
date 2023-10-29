require('dotenv').config();
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

authRouter.post(
    '/signup',
    passport.authenticate('signup', { session: false }), async (req, res, next) => {
        res.json({
            message: 'Signup was successful!',
            user: req.user
        });
    }
);

authRouter.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate('login', async (error, user, info) => {
            try {
                if (error) {
                    return next(error);
                }
                
                if (!user) {

                }
            } catch (error) {
                console.log(error);
            }
        })
    }
);

module.exports = authRouter;