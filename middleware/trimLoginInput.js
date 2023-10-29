const trimLoginInput = (req, res, next) => {
    req.body.email = req.body.email.trim();
    next();
}

module.exports = trimLoginInput;