const express = require('express')
const AudioDownloadService = require('../service/AudioDownloadService')

const router = express.Router()


router.get('/info', (req, res) => {
    res.status(200).send({
        supported: AudioDownloadService.getSupportedSites()
    })
})

router.get('/', (req, res) => {
    const code = req.query.code

    if (!code) {
        res.status(400).send({
            error: `Parameter 'code' is missing`
        })
        return
    }
    console.log(`Downloading Youtube video ${code} as MP3`)

    AudioDownloadService.download(code)
    res.status(204).send()
})


router.ws('/download', function (ws, req) {

    const code = req.query.code

    if (!code) {
        console.log(`Parameter 'code' is missing`)
        return
    }
    console.log(`Parameter 'code' is ${code}`)

    AudioDownloadService.download(code)

    
    // ws.on('message', function (msg) {
    //   console.log('websocket message:', msg)
    //   ws.send(msg)
    // })
  })

module.exports = router