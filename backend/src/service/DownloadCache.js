const crypto = require('crypto')
const EventsService = require('./EventsService')


const CACHE = {}


const STATUS_STARTING = `STARTING`
const STATUS_IN_PROGRESS = `IN_PROGRESS`
const STATUS_ERROR = `ERROR`
const STATUS_COMPLETE_CONVERTING = `COMPLETE_CONVERTING`
const STATUS_FINISHED = `FINISHED`

function publish(download) {
    let eventData = {
        id: download.id,
        status: download.status,
        ...download.progress
    }
    EventsService.emit(EventsService.EVENT_NAME, eventData)
    console.log('Update: ', eventData)
}

module.exports = {

    addDownload: (metadata, audioOnly) => {
        var id = crypto.createHash('md5')
                       .update(new Date().toISOString())
                       .digest('hex')

        var format = audioOnly ? 'mp3' : 'mp4'
        var targetFile = `${metadata.fulltitle}.${format}`

        var download = {
            id: id,
            status: STATUS_STARTING,
            audioOnly: audioOnly,
            metadata: metadata,
            format: format,
            targetFile: targetFile,
            progress: {
                start: new Date().getTime(),
                percentage: 0,
                eta: 'Unknown',
                position: 0,
                speed: 0
            }
        }

        CACHE[id] = download
        publish(download)

        return download
    },

    updateDownload: (id, progress) => {
        let download = CACHE[id]
        download.status = STATUS_IN_PROGRESS

        download.progress.percentage = progress.percentage
        download.progress.eta = progress.eta
        download.progress.position = progress.position
        download.progress.speed = progress.speed

        publish(download)
    },

    completedAndConvertingDownload: (id) => {
        let download = CACHE[id]
        download.status = STATUS_COMPLETE_CONVERTING

        publish(download)
    },

    finishDownload: (id, data) => {
        let download = CACHE[id]
        download.status = STATUS_FINISHED
        
        download.progress.end = data.end
        download.progress.duration = data.duration
        download.targetFile = data.filename

        publish(download)
    },

    downloadError: (id) => {
        let download = CACHE[id]
        download.status = STATUS_ERROR

        publish(download)
    },

    getAllDownloads: () => {
        return {
            ...CACHE
        }
    },

    getDownload: (id) => {
        return {
            ...CACHE[id]
        }
    },

    clearDownloads: () => {
        Object.keys(CACHE).forEach(id => {
            let download = CACHE[id]
            if (download.status === STATUS_ERROR || download.status === STATUS_FINISHED) {
                delete CACHE[id]
            }
        })
    },

}