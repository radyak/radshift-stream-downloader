module.exports = (req, res, next) => {
    let user = req.headers['x-user']
    if (!user) {
        res.status(401).send()
        return
    }
    req.user = user
    next()
}