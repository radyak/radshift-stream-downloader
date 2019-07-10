const express = require('express')
const DownloadService = require('../service/DownloadService')

const router = express.Router()


router.get('/', (req, res) => {
    res.status(200).send(DownloadService.getFiles())
})


router.get('/:filename', (req, res) => {
    const filename = req.params.filename
    const filepath = DownloadService.getFilePath(filename)

    if (!filepath) {
        console.log('Cannot GET', filename)
        res.status(404).send()
    }

    res.download(filepath)
})



module.exports = router