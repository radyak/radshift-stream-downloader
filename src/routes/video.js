const express = require('express')
const DownloadService = require('../service/DownloadService')

const router = express.Router()


// Trigger and subscribe download via Websocket
// Example: ws://localhost:3009/api/video/download?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DsBzrzS1Ag_g
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
        format: 'mp4'
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