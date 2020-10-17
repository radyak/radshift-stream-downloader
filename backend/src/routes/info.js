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
       .send({
        username: req.header('X-User')
    })
})


router.get('/video', (req, res) => {
    let url = req.query.url
    console.log(`Searching info for ${url}`)
    YoutubeDlWrapper.getInfo(url)
        .then(info => {
            if (info) {
                res.status(200).send(info)
            }
        })
        .catch(e => {
            res.status(400).send(e)
        })
})


router.get('/meta', (req, res) => {
    res.status(200).send({
        version: process.env.npm_package_version
    })
})

module.exports = router