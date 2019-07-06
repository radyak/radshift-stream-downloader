const YoutubeMp3Downloader = require("youtube-mp3-downloader")
const EventEmitter = require('events')
 
const eventEmitter = new EventEmitter()
const rootPath = process.cwd()

var YD = new YoutubeMp3Downloader({
    "ffmpegPath": process.env.FFMPEG_PATH || rootPath + "/ffmpeg-4.1.3-i686-static/ffmpeg",

    "outputPath": process.env.OUTPUT_PATH || rootPath + "/output",

    "youtubeVideoQuality": process.env.OUTPUT_QUALITY || "highest",

    "queueParallelism": process.env.PARALLEL_DOWNLOADS || 2,

    "progressTimeout": process.env.REPORT_INTERVAL || 2000
})
 

// Example for `data`:
// {"videoId":"Jmtte8urjFk","stats":{"transferredBytes":261227940,"runtime":154,"averageSpeed":1685341.55},"file":"/home/fvo/private/dev/radshift/youtube-dl/output/Die großen Mythen - Athene | ARTE.mp3","youtubeUrl":"http://www.youtube.com/watch?v=Jmtte8urjFk","videoTitle":"Die großen Mythen - Athene | ARTE","artist":"Die großen Mythen","title":"Athene | ARTE","thumbnail":null}
YD.on("finished", function(err, data) {
    eventEmitter.emit(`finished-${data.videoId}`, data)
    eventEmitter.emit(`finished`, data)
})
 
YD.on("error", function(error) {
    eventEmitter.emit(`error-${error.videoId}`, error)
    eventEmitter.emit(`error`, error)
})
 
// Example for `progress`:
// {"videoId":"Jmtte8urjFk","progress":{"percentage":98.70355483414217,"transferred":257841263,"length":261227940,"remaining":3386677,"eta":2,"runtime":152,"delta":3495266,"speed":1685237.0130718953}}
YD.on("progress", function(progress) {
    eventEmitter.emit(`progress-${progress.videoId}`, progress)
    eventEmitter.emit(`progress`, progress)
})

YD.on("queueSize", function(size) {
    eventEmitter.emit(`queue`, size)
});



class DownloadEvents {
    constructor(videoId) {

        this.onProgress = (handler) => {
            eventEmitter.on(`progress-${videoId}`, (event) => {
                event.type = `progress`
                handler(event)
            })
        }

        this.onError = (handler) => {
            eventEmitter.on(`error-${videoId}`, (event) => {
                event.type = `error`
                event.message = `An error occurred while downloading video ${videoId} as MP3`
                handler(event)
            })
        }

        this.onFinished = (handler) => {
            eventEmitter.on(`finished-${videoId}`, (event) => {
                event.type = `finished`
                event.message = `Finished downloading video ${videoId} as MP3`
                handler(event)
            })
        }
    }
}

module.exports = {

    getSupportedSites: () => {
        return [
            'youtube'
        ]
    },

    /*
    Problem with youtube-mp3-downloader: Doesn't work with some (presumably copy-righted) videos, e.g.:

    works: KpOtuoHL45Y (Franz Liszt - Liebestraum; https://www.youtube.com/watch?v=KpOtuoHL45Y)
    doesn't work: eoU7_qCgUAI (Tame Impala - The Less I Know The Better; https://www.youtube.com/watch?v=eoU7_qCgUAI)

    The actual problem is that even 
     */
    download: (videoId, fileName, callback) => {
        YD.download(videoId, fileName)
        eventEmitter.emit('start', {
            'type': `started`,
            'message': `Started downloading video ${videoId}`
        })
        if (callback) {
            callback({
                'type': `started`,
                'message': `Started downloading video ${videoId} as MP3` + ( fileName ? `to file ${fileName}` : '')
            })
        }
        return new DownloadEvents(videoId)
    },

    onQueueSizeChange(handler) {
        eventEmitter.on(`progress`, (event) => {
            event.type = `progress`
            handler(event)
        })
    },

    onStart(handler) {
        eventEmitter.on(`start`, (event) => {
            event.type = `start`
            handler(event)
        })
    },

    onProgress(handler) {
        eventEmitter.on(`progress`, (event) => {
            event.type = `progress`
            handler(event)
        })
    },

    onError(handler) {
        eventEmitter.on(`error`, (event) => {
            event.type = `error`
            event.message = `An error occurred while downloading video ${videoId} as MP3`
            handler(event)
        })
    },

    onFinished(handler) {
        eventEmitter.on(`finished`, (event) => {
            event.type = `finished`
            event.message = `Finished downloading video ${videoId} as MP3`
            handler(event)
        })
    }
}
