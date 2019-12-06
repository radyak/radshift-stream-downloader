const express = require('express')

const router = express.Router()


router.all('', function (req, res) {

    console.log(
        'Share request:', 
        {
            originalUrl: req.originalUrl,
            headers: req.headers,
            body: req.body
        })

    let url = req.body && req.body.url ? req.body.url : ''
    let text = req.body && req.body.text ? req.body.text : ''
    res.redirect(`/start?url=${url || text}`)

})


module.exports = router