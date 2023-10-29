const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author_fn: {
        type: String,
        required: true
    },
    author_ln: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    state: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'draft'
    },
    read_count: {
        type: Number,
        default: 0
    },
    reading_time: {
        type: mongoose.Schema.Types.Mixed
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;