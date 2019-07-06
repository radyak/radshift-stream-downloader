const express = require('express')
const AudioDownloadService = require('../service/AudioDownloadService')

const router = express.Router()


router.get('/info', (req, res) => {
    res.status(200).send({
        supported: AudioDownloadService.getSupportedSites()
    })
})

// Trigger download via HTTP request
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

// Trigger and subscribe download via Websocket
router.ws('/download', function (ws, req) {

    const code = req.query.code
    const fileName = req.query.filename ? req.query.filename + '.mp3' : null

    if (!code) {
        console.log(`Parameter 'code' is missing`)
        ws.send(JSON.stringify({
            'type': `error`,
            'message': `Parameter 'code' is missing`
        }))
        ws.close()
        return
    }
    console.log(`Parameter 'code' is ${code}`)

    const forwardToWebsocket = (data) => {
        ws.send(JSON.stringify(data))
    }

    var events = AudioDownloadService.download(code, fileName, forwardToWebsocket)

    events.onProgress(forwardToWebsocket)
    events.onError(forwardToWebsocket)
    events.onFinished((data) => {
        forwardToWebsocket(data)
        ws.close()
    })

  })

module.exports = router