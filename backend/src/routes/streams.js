const express = require('express')
const mediaserver = require('mediaserver')
const FileStorageService = require('../service/FileStorageService')

const router = express.Router()


let getExtension = (filename) => {
    let parts = filename.split('.')
    let indexOfLastElement = parts.length - 1
    return parts[indexOfLastElement]
}


router.get('/:filename', (req, res) => {
    const filename = req.params.filename
    const filepath = FileStorageService.getFilePath(filename, req.user)

    if (!filepath) {
        console.log('Cannot GET', filename)
        res.status(404).send()
    }

    mediaserver.pipe(req, res, filepath, getExtension(filename))
})



module.exports = router