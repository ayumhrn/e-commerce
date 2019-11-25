/* istanbul ignore file */
module.exports = (req, res, next) => {
    if (req.decoded.role === 'customer') {
        return res.status(401).json({
            message: 'You are not authorized'
        });
    }

    return next();
};