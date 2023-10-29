const express = require('express');
const indexRoute = express.Router();
const blogModel = require('../model/BlogModel');
const { extractTimeAndDate } = require('../controllers/blog/blogDateAndTime');

indexRoute.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        const sortCriteria = req.query.sort || 'timestamp';

        const totalBlogs = await blogModel.countDocuments({ state: 'Published' });
        const totalPages = Math.ceil(totalBlogs / limit);

        if (page > totalPages) {
            return res.redirect(`/?page=${totalPages}&sort=${sortCriteria}`)
        }

        if (page < 1) {
            return res.redirect(`/?page=1&sort=${sortCriteria}`)
        }

        let sortQuery;

        if (sortCriteria === 'timestamp') {
            sortQuery = { timestamp: -1 };
        } else if (sortCriteria === 'read_count') {
            sortQuery = { read_count: -1 };
        } else if (sortCriteria === 'reading_time') {
            sortQuery = { reading_time: -1};
        } else {
            sortQuery = { timestamp: 1 }
        }

        const searchQuery = req.query.q;
        let query = { state: 'Published' };
        
        if (searchQuery) {
            query = {
                $and: [
                    { state: 'Published' },
                    {
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i'} },
                            { tag: { $regex: searchQuery, $options: 'i'} },
                            {
                                $or: [
                                    { author_fn: {$regex: searchQuery, $options: 'i'} },
                                    { author_ln: {$regex: searchQuery, $options: 'i'} }
                                ]
                            }
                        ]
                    }
                ]
            };
        }

        let blogs = await blogModel.find(query)
                        .limit(limit)
                        .skip(skip)
                        .sort(sortQuery)

        const paginatedBlogs = extractTimeAndDate(blogs);

        // console.log(paginatedBlogs)

        const lastBlog = await blogModel.find({ state: 'Published' }).sort({ _id: -1 }).limit(1);

        res.status(200).render('index', {
            title: "Mosaic Jots",
            links: [
                { link_name: 'Login', url: '/login' }
            ],
            blogs: paginatedBlogs,
            lastBlog,
            page,
            totalPages,
            sort: sortCriteria,
            req: req
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error!');
    }
})

module.exports = indexRoute;