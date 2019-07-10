const express = require('express')
const DownloadService = require('../service/DownloadService')

const router = express.Router()


router.get('/info', (req, res) => {
    res.status(200).send({
        supported: [] //DownloadService.getSupportedSites()
    })
})

// Trigger download via HTTP request
// router.get('/', (req, res) => {
//     const code = req.query.code

//     if (!code) {
//         res.status(400).send({
//             error: `Parameter 'code' is missing`
//         })
//         return
//     }
//     console.log(`Downloading Youtube video ${code} as MP3`)

//     AudioDownloadService.download(code)
//     res.status(204).send()
// })


// Trigger and subscribe download via Websocket
// Example: ws://localhost:3009/api/audio/download?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DKpOtuoHL45Y
router.ws('/download', function (ws, req) {

    const url = req.query.url

    if (!url) {
        console.log(`Parameter 'url' is missing`)
        ws.send(JSON.stringify({
            'type': `error`,
            'message': `Parameter 'url' is missing`
        }))
        ws.close()
        return
    }

    const forwardToWebsocket = (data) => {
        ws.send(JSON.stringify(data))
    }

    DownloadService.download(url, {
        format: 'mp3'
    }).then(events => {
        events.onProgress(forwardToWebsocket)
        events.onError(forwardToWebsocket)
        events.onFinished((data) => {
            forwardToWebsocket(data)
            ws.close()
        })
    })


  })

module.exports = router