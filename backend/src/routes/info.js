const express = require('express')
const DownloadService = require('../service/DownloadService')

const router = express.Router()


router.get('/', (req, res) => {
    DownloadService.getSupportedStreams()
        .then(streams => {
            res.status(200).send({
                supported: streams
            })
        })
})

module.exports = router