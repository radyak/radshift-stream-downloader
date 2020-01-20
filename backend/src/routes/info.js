const express = require('express')
const DownloadService = require('../service/DownloadService')
const Downloader = require('../service/Downloader')


const router = express.Router()


router.get('/auth', (req, res) => {
    res.status(200)
       .send({
        username: req.header('X-User')
    })
})


router.get('/video', (req, res) => {
    let url = req.query.url
    console.log(`Searching info for ${url}`)
    Downloader.getInfo(url)
        .then(info => {
            res.status(200).send(info)
        })
        .catch(e => {
            console.log(e)
            res.status(400).send(e)
        })
})

module.exports = router