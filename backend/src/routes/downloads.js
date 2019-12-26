const express = require('express')
const DownloadService = require('../service/DownloadService')
const EventsService = require('../service/EventsService')


const router = express.Router()


/* 
    Example:
    POST http://localhost:3009/api/downloads
    {
        "url": "https://www.youtube.com/watch?v=KpOtuoHL45Y",
        "audioOnly": true
    }
*/
router.post('', function (req, res) {

    const url = req.body.url
    const audioOnly = !!req.body.audioOnly

    if (!url) {
        console.log(`Parameter 'url' is missing`)
        res.status(400).send({
            'type': `error`,
            'message': `Parameter 'url' is missing`
        })
        return
    }

    DownloadService.startDownload(url, audioOnly, req.user)
    .then(download => {
        res.status(202).send(download)
    })

})

router.get('', function (req, res) {
    const downloadInfo = DownloadService.getAllDownloads()
    res.status(200).send(downloadInfo)
})


// Subscribe to subject via Websocket
// Example: ws://localhost:3009/api/audio/downloads
router.ws('', function (ws, req) {

    let open = true

    let defaultEventHandler = (event) => {
        if (open) {
            ws.send(JSON.stringify(event))
        }
    }


    EventsService.on(EventsService.EVENT_NAME, defaultEventHandler)

    ws.on('error', (error) => {
        open = false
    })

    ws.on('close', (event) => {
        open = false
        EventsService.remove(EventsService.EVENT_NAME, defaultEventHandler)
    })

})


module.exports = router