const logger = require('../../logger');
const blogModel = require('../../model/BlogModel');

async function getBlog(req, res) {
    try {
        const blogId = req.params.id;
        let blog = await blogModel.findById(blogId);

        if (!blog) {
            res.json({ message: 'Blog not found!' });
            return;
        }

        blog.read_count++;
        await blog.save();

        const timestamp = new Date(blog.timestamp);
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        };

        const formattedDate = timestamp.toLocaleDateString('en-US', options);

        res.status(200).render('blog', {
            title: 'Blog',
            links: [
                { link_name: 'Home', url: '/' }
            ],
            message: { error: null },
            blog: blog,
            formattedDate,
            req
        })
    } catch (error) {
        logger.error('Internal Server Error!', error);
        res.status(500).send('Internal Server Error!')
    }
}

module.exports = { getBlog };