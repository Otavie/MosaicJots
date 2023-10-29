const logger = require('./logger');
require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database');
const routes = require('./routes/routes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const { default: helmet } = require('helmet');
const PORT = process.env.PORT || 3232;
const app = express();

// Create a MongoDB Session Store
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 60 * 60,
})

app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cookieParser());

// Configure Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Database Connection
database.connectToDatabase();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(flash());

// Define Base Path for Routes
app.use('/', routes);

// Page Not Found Route
app.use((req, res) => {
    res.status(404).render('error',{
        title: "Page Not Found!",
        links: [
            { link_name: 'Home', url: '/' },
            { link_name: 'Login', url: '/login' },
            { link_name: 'Logout', url: '/logout' }
        ],
        req,
    });
    logger.error('Page Not Found!', { status: 404, url: req.originalUrl });
});


app.listen(PORT, () => {
    logger.info(`Server started successfully on http://localhost:${PORT}`);
});