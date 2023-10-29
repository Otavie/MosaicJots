const trimSignupInput = (req, res, next) => {
    req.body.first_name = req.body.first_name.trim();
    req.body.last_name = req.body.last_name.trim();
    req.body.email = req.body.email.trim();
    next();
}

module.exports = trimSignupInput;