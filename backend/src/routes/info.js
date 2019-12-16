const express = require('express')
const DownloadService = require('../service/DownloadService')
const YoutubeDlWrapper = require('../service/YoutubeDlWrapper')


const router = express.Router()


router.get('/supported-sites', (req, res) => {
    DownloadService.getSupportedStreams()
        .then(streams => {
            res.status(200).send({
                supported: streams
            })
        })
})


router.get('/auth', (req, res) => {
    res.status(200)
       .json({
           username: req.header('X-User')
       })
       .send()
})


router.get('/video', (req, res) => {
    let url = req.query.url
    console.log(`Searching info for ${url}`)
    YoutubeDlWrapper.getInfo(url)
        .then(metadata => {
            res.status(200).send(metadata)
        })
        .catch(e => {
            console.log(e)
            res.status(400).send(e)
        })
})

module.exports = router