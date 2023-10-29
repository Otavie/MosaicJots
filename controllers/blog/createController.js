const logger = require('../../logger');
const blogModel = require('../../model/BlogModel');
const userModel = require('../../model/UserModel');

function getReadingTime(minutes) {
    return minutes > 1 ? `${minutes} minutes` : `${minutes} minute`
}

async function getCreate(req, res) {
    try {
        res.status(200).render('create', {
            title: 'Create Blog',
            links: [{ link_name: 'Cancel', url: '/dashboard' }],
            req
        })
    } catch (error) {
        logger.error('Error rendering create page:', error);
        res.status(500).json({error: 'Internal Server Error!'})
    }
}

async function postCreate(req, res) {
    try {
        const { title, description, body, author_fn, author_ln, tag, state, reading_time } = req.body;

        // Default Values for State and Tag
        const entryState = state || 'Draft';
        const entryTag = tag || 'Business';

        const userEmail = req.session.email;
        const user = await userModel.findOne({ email: userEmail });
        const userId = user._id;

        if (!user) {
            logger.warn('User Not Found!', { userEmail });
            return res.status(404).json({ error: 'User Not Found!' });
        }

        const wordPerMinute = 200;
        const words = body.split('').length;
        let readingTime = Math.round(words / wordPerMinute);

        readingTime = getReadingTime(readingTime);

        // Create the Blog Object
        const blog = new blogModel({
            title,
            description,
            body,
            author_fn,
            author_ln,
            tag: entryTag,
            state: entryState,
            reading_time: readingTime,
            userId: userId
        });
    
        await blog.save();
        req.flash('success', 'Blog created successfully!');
        res.redirect('/dashboard');

        req.session.email = user.email;
        req.session.name = user.name;

    } catch (error) {
        logger.error('Error while creating blog', error)
        res.status(500).json({ error: 'Internal Server Error!' });
    }
}

module.exports = { getCreate, postCreate }