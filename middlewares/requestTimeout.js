const { TIMEOUT } = process.env;

const timeoutMiddleware = (req, res, next) => {
    const { timeout = TIMEOUT } = req.query;

    res.setTimeout(Number(timeout), () => {
        if (!res.headerSent) {
            res.status(408).send('Response Timeout');
        }
    });
    next();
}

module.exports = timeoutMiddleware;