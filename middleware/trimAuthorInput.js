const trimLoginInput = (req, res, next) => {
    req.body.author_fn = req.body.author_fn.trim();
    req.body.author_fn = req.body.author_fn.trim();
    next();
}

module.exports = trimLoginInput;