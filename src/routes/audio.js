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
router.ws('/download', function (ws, req) {

    console.log('hier')

    ws.send(JSON.stringify({
        test: "works"
    }))

    const url = decodeURIComponent(req.query.url)

    if (!url) {
        console.log(`Parameter 'url' is missing`)
        ws.send(JSON.stringify({
            'type': `error`,
            'message': `Parameter 'url' is missing`
        }))
        ws.close()
        return
    }
    console.log(`Parameter 'url' is ${url} (was ${req.query.url})`)

    const forwardToWebsocket = (data) => {
        ws.send(JSON.stringify(data))
    }

    var events = DownloadService.download(url, {
        format: 'mp3'
    })

    events.onProgress(forwardToWebsocket)
    events.onError(forwardToWebsocket)
    events.onFinished((data) => {
        forwardToWebsocket(data)
        ws.close()
    })

  })

module.exports = router