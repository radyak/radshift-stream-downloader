const express = require('express')
const mediaserver = require('mediaserver')
const FileStorageService = require('../service/FileStorageService')

const router = express.Router()


router.get('/:filename', (req, res) => {
    const filename = req.params.filename
    const filepath = FileStorageService.getFilePath(filename, req.user)

    if (!filepath) {
        console.log('Cannot GET', filename)
        res.status(404).send()
    }

    mediaserver.pipe(req, res, filepath)
})



module.exports = router