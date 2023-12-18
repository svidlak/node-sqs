const requestBodyValidator  = (req, res, next) => {
    if(!req?.body?.message) {
        return res.sendStatus(400);
    }
    next();
}

module.exports = requestBodyValidator;