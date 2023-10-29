require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const navLinks = [
    { link_name: 'Home', url: '/' },
    { link_name: 'Signup', url: '/signup' }
]

module.exports = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization;

    if(!token) {
        return res.status(401).render('login', {
            title: 'Access Error!',
            links: navLinks,
            email: '',
            errors: { error: 'No token provided! You have to log in' },
            req
        });
    }

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if(error) {
            return res.status(401).render('login', {
                title: 'Access Error!',
                links: navLinks,
                email: '' ,
                errors: { error: 'Invalid token!' },
                req
            });
        }
        
        req.user = decoded;
        next();
    });
}