const logger = require('./logger');
const mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = process.env.MONGODB_URI;

// Connect to the Database
const connectToDatabase = () => {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    mongoose.connection.on('connected', () => {
        logger.info('Connected to the DB successfully!');
    });
    mongoose.connection.on('error', (error) => {
        logger.info('Error Connecting to DB', error);
    });
    mongoose.connection.on('disconnected', () => {
        logger.info('DB is Disconnected!')
    })
}

module.exports = { connectToDatabase };