const express = require('express')
const FileStorageService = require('../service/FileStorageService')

const router = express.Router()


router.get('/', (req, res) => {
    res.status(200).send(FileStorageService.getFiles())
})


router.get('/:filename', (req, res) => {
    const filename = req.params.filename
    const filepath = FileStorageService.getFilePath(filename)

    if (!filepath) {
        console.log('Cannot GET', filename)
        res.status(404).send()
    }

    res.download(filepath)
})

router.delete('/:filename', (req, res) => {
    const deletedFilepath = FileStorageService.deleteFile(req.params.filename)

    if (!deletedFilepath) {
        console.log('Cannot DELETE', filename)
        res.status(404).send()
    }

    res.status(200).send(FileStorageService.getFiles())
})



module.exports = router