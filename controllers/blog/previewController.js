async function preview(req, res) {
    try {
        res.status(200).render('preview', {
            title: 'Preview',
            links: [
                { link_name: 'Publish', url: '/dashboard' },
                { link_name: 'Back to Create', url: '/dashboard/create' }
            ],
            message: { error: null },
            req
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error!' });
    }
}

module.exports = { preview }