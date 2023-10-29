function extractTimeAndDate(blogs) {
    return blogs.map((blog) => {
        const timestamp = new Date(blog.timestamp);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        const formattedDate = timestamp.toLocaleString('en-US', options);
        return {
            ...blog,
            date: formattedDate,
            time: timestamp.toLocaleTimeString()
        }
    })
}

module.exports = { extractTimeAndDate };