module.exports = (req, res, next) => {
    let user = req.headers['x-user']
    if (user) {
        req.user = user
    }
    next()
}