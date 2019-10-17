const express = require('express')

const router = express.Router()


router.all('', function (req, res) {

    console.log(
        'Request:', 
        {
            originalUrl: req.originalUrl,
            headers: req.headers,
            body: req.body
        })

    // res.status(200).send(req.body)
    res.redirect(`/apps/radshift-stream-downloader/start?url=${req.body.url || req.body.text || 'abc'}`)

})


module.exports = router