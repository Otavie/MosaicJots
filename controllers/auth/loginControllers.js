const logger = require('../../logger');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../../model/UserModel');

const tokenAge = 60 * 60;
const cookieAge = 60 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET;
const navLinks = [
    { link_name: 'Home', url: '/'},
    { link_name: 'Signup', url: '/signup'}
]

async function getLogin(req, res) {
    try {
        const { email } = req.body;

        res.status(200).render('login', {
            title: 'Login',
            links: navLinks,
            email: !email ? '' : email,
            errors: { error: null },
            req
        })
    } catch (error) {
        logger.error('Error in getLogin Page: ', error);
        res.status(500).send('Internal Server Error!');
    }
}

async function postLogin(req, res) {
    const { email, password } = req.body;
    const errors = {};

    try {
        if (email === '') {
            errors.email = 'Please enter your email address!';
        }

        // Find User by Email
        const user = await userModel.findOne({ email });

        if (!user) {
            errors.email = 'Invalid email address';
        } else {
            // Verify the Password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                errors.password = 'Password is wrong!';
            }
        }

        // Store the User's Details in the Session
        req.session.email = user.email;
        req.session.firstName = user.first_name;
        req.session.lastName = user.last_name;
        
        if (Object.keys(errors).length > 0) {
            res.status(400).render('login', {
                title: 'Login Error!',
                links: navLinks,
                email,
                errors,
                req
            });
            logger.warn('Login Error!', { email, errors });
            return;
        }

        // Generate a JWT Token and Store it in a Secure HttpOnly Cookie
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {expiresIn: tokenAge });
        res.cookie('token', token, { httpOnly: true, maxAge: cookieAge });
        
        res.redirect('/dashboard')

    } catch (error) {
        logger.error('Error in postLogin: ', error);
        res.status(500).send('Internal Server Error!');
    }
}

module.exports = { getLogin, postLogin }