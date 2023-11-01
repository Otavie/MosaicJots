const logger = require('../../logger');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const userModel = require('../../model/UserModel');
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');

const navLinks = [
    { link_name: 'Home', url: '/' },
    { link_name: 'Login', url: '/login' }
]
const cookieAge = 60 * 60 * 1000;
const tokenAge = 60 * 60;

async function getSignup(req, res) {
    try {
        const { first_name, last_name, email } = req.body;
        const missingInput = !first_name || !last_name || !email;

        res.status(200).render('signup', {
            title: 'Sign up',
            links: navLinks,
            first_name: missingInput ? '' : first_name,
            last_name: missingInput ? '' : last_name,
            email: missingInput ? '' : email,
            errors: {},
            req
        })
    } catch (error) {
        logger.error('getSignup Error: ', error);
        res.status(500).send('Internal Server Error!');
    }
}

async function postSignup(req, res) {
    const { first_name, last_name, email, password } = req.body;
    const errors = {};

    try {
        if (first_name === '') {
            errors.first_name = 'Please enter your first name!';
        }

        if (last_name === '') {
            errors.last_name = 'Please enter your last name!';
        }

        if (email === '') {
            errors.email = 'Please enter your email address!';
        }
        
        if (password === '') {
            errors.password = 'Please enter your password!';
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters long!';
        } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
            errors.password = 'Password must contain at least an uppercase, a lowercase, a number and a special character (!, @, #, $, %, ^, &, *)!'
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            errors.email = 'Email already in use!';
        }

        // req.session.firstName = first_name;

        if (Object.keys(errors).length > 0) {
            logger.warn('Signup Error!', { errors, first_name, last_name, email });
            return res.status(400).render('signup', {
                title: 'Signup Error!',
                links: navLinks,
                errors,
                first_name,
                last_name,
                email,
                req,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a New User and Save it in User DB
        const newUser = new userModel({ first_name, last_name, email, password: hashedPassword });
        await newUser.save();

        // Generate a JWT Token and Store it in a Secure HttpOnly Cookie
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {expiresIn: tokenAge });
        res.cookie('token', token, { httpOnly: true, maxAge: cookieAge });

        // Store the User's Details in the Session
        req.session.email = newUser.email;
        req.session.first_name = newUser.first_name;
        req.session.last_name = newUser.last_name;

        // Store Success Message in Session Variable and redirect to dashboard
        req.session.successMessage = 'User registered successfully!';
        res.redirect('/dashboard');

    } catch (error) {
        logger.error('Internal Server Error!', error);
        res.status(500).json({ message: 'Internal Server Error!' });
    }
}

module.exports = { getSignup, postSignup }