const logger = require('../../logger');
const userModel = require('../../model/UserModel');
const blogModel = require('../../model/BlogModel');
const { extractTimeAndDate } = require('./blogDateAndTime');

function getReadingTime(minutes) {
    return minutes > 1 ? `${minutes} minutes` : `${minutes} minute`
}

async function getDashboard(req, res) {
    try {
        const email = req.session.email;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User Not Found Get Request!' })
        }
        const userId = user._id;
        
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        const filterState = req.query.state || 'All';

        let totalBlogs, userBlogs;

        if (filterState === 'All') {
            totalBlogs = await blogModel.countDocuments({ userId });
            userBlogs = await blogModel.find({ userId })
                            .limit(limit)
                            .skip(skip);
        } else {
            totalBlogs = await blogModel.countDocuments({ userId, state: filterState });
            userBlogs = await blogModel.find({ userId, state: filterState })
                            .limit(limit)
                            .skip(skip);
        }

        const totalPages = Math.ceil(totalBlogs / limit);

        if (page > totalPages) {
            return res.redirect(`/dashboard/?page=${totalPages}&state=${filterState}`)
        }

        if (page < 1) {
            return res.redirect(`/dashboard/?page=1&state=${filterState}`);
        }

        userBlogs = extractTimeAndDate(userBlogs);

        res.status(200).render('dashboard', {
            title: 'Dashboard',
            links:[
                { link_name: 'Create Blog', url: '/dashboard/create' },
                { link_name: 'Logout', url: '/logout' },
            ],
            message: { error: null },
            blogs: userBlogs,
            selectedState: filterState,
            page,
            totalPages,
            req
        })

    } catch (error) {
        logger.error('Error in getDashboard', error);
        res.status(500).json('Internal Server Error!');
    }
}

async function postDashboard(req, res) {
    try {
        const email = req.session.email;

        const { title, description, body, tag, state } = req.body;

        // Default State is Draft
        const entryState = state || "Draft";

        const user = await userModel.findOne({ email });
        const userId = user._id;

        if (!user) {
            return res.status(404).json({ error: 'User Not Found! Post Request' });
        }

        // Create a New Blog
        const newBlog = new blogModel({ title, description, body, tag, state: entryState, userId: userId });
        await newBlog.save();

        res.redirect('/dashboard');

    } catch (error) {
        logger.error('Error in postDashboard', error);
        res.status(500).send('Internal Server Error!');
    }
}

async function getEditBlog(req, res) {
    try {
        const blogId = req.params.id;
        blogToEdit = await blogModel.findById(blogId);

        if (!blogToEdit) {
            return res.status(500).json({ error: 'Blog not found!' });
        }

        res.status(200).render('edit', {
            title: 'Edit Blog',
            links: [{ link_name: 'Logout', url: '/logout' }],
            blog: blogToEdit,
            message: {},
            req,
        })


    } catch (error) {
        logger.error('Error in getEditBlog', error);
        res.status(500).json({ error: 'Fail to edit the blog!' })
    }
}

async function postEditBlog(req, res) {
    try {
        const blogId = req.params.id;
        const { title, description, body, author_fn, author_ln, tag, state } = req.body;

        const wordPerMinute = 200;
        const words = body.split('').length;
        let readingTime = Math.round(words / wordPerMinute);

        readingTime = getReadingTime(readingTime);

        const updatedBlog = await blogModel.findByIdAndUpdate(
            blogId,
            {
                title,
                description,
                body,
                author_fn,
                author_ln,
                tag,
                state,
                reading_time: readingTime
            },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found!' });
        }

        res.redirect('/dashboard');
        
    } catch (error) {
        logger.error('Error in postEditBlog', error);
        res.status(500).json({ error: 'Fail to update the blog!'})
    }

}

async function getDeleteBlog(req, res) {
    try {
        const blogId = req.params.id;
        blogToDelete = await blogModel.findById(blogId);

        if (!blogToDelete) {
            return res.status(500).json({ error: 'Blog not found!' });
        }

        res.status(200).render('delete', {
            title: 'Delete Blog',
            links: [{ link_name: 'Logout', url: '/logout' }],
            blog: blogToDelete,
            message: {},
            req,
        })


    } catch (error) {
        logger.error('Error in getDeleteBlog', error);
        res.status(500).json({ error: 'Fail to delete the blog!' })
    }
}

async function postDeleteBlog(req, res) {
    try {
        const blogId = req.params.id;
        const blogToDelete = await blogModel.findById(blogId);

        if (!blogToDelete) {
            return res.status(404).json({ error: 'Blog not found!' });
        }
        
        await blogModel.findByIdAndRemove(blogId);

        res.redirect('/dashboard')
    } catch (error) {
        logger.error('Error in postDeleteBlog', error);
        res.status(500).json({ error: 'Fail to delete the blog!' })        
    }
}


// async function getPreview(req, res) {
//     try {
//         const { title, body, author_fn, author_ln, tag } = req.body;
//         let blogTitle = title;
//         const wordPerMinute = 200;
//         const words = body.split('').length;
//         let readingTime = Math.round(words / wordPerMinute);
//         readingTime = getReadingTime(readingTime);

//         res.status(200).render('preview', {
//             title: 'Blog Preview',
//             blogTitle,
//             body,
//             author_fn,
//             author_ln,
//             tag,
//             readingTime,
//             links: [
//                 { link_name: 'Dashboard', url: '/dashboard' },
//                 { link_name: 'Cancel', url: '/dashboard/create' }
//             ],
//             req
//         });
//     } catch (error) {
//         logger.error('Error in getBlogPreview', error);
//         res.status(500).json({ error: 'Internal Server Error!' });
//     }
// }


async function getPreview(req, res) {
    try {
        const { title, body, author_fn, author_ln, tag } = req.body;

        console.log(title)
        console.log(body)
        console.log(author_fn)
        console.log(author_ln)
        console.log(tag)

        if (title && body && author_fn && author_ln && tag) {
            let blogTitle = title;
            const wordPerMinute = 200;
            const words = body.split('').length; 
            let readingTime = Math.round(words / wordPerMinute);
            readingTime = getReadingTime(readingTime);

            res.status(200).render('preview', {
                title: 'Blog Preview',
                blogTitle,
                body,
                author_fn,
                author_ln,
                tag,
                readingTime,
                links: [
                    { link_name: 'Dashboard', url: '/dashboard' },
                    { link_name: 'Cancel', url: '/dashboard/create' }
                ],
                req
            });
        } else {
            // Handle the case where one of the expected properties in req.body is undefined or empty
            res.status(400).json({ error: 'Invalid request data' });
        }
    } catch (error) {
        logger.error('Error in getBlogPreview', error);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
}


module.exports = { 
    getDashboard,
    postDashboard,
    getEditBlog,
    postEditBlog,
    getDeleteBlog,
    postDeleteBlog,
    // getPreview
}