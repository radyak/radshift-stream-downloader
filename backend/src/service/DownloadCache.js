const crypto = require('crypto')
const EventsService = require('./EventsService')


const CACHE = {}


const STATUS_STARTING = `STARTING`
const STATUS_IN_PROGRESS = `IN_PROGRESS`
const STATUS_ERROR = `ERROR`
const STATUS_COMPLETE_CONVERTING = `COMPLETE_CONVERTING`
const STATUS_FINISHED = `FINISHED`

const STEP_THRESHOLD = 1


function publish(download) {
    let eventData = {
        id: download.id,
        status: download.status,
        ...download.progress
    }
    EventsService.emit(EventsService.EVENT_NAME, eventData)
    // console.log('Update: ', eventData)
}

module.exports = {

    addDownload: (metadata, audioOnly, size, targetFile) => {
        var id = crypto.createHash('md5')
                       .update(new Date().toISOString())
                       .digest('hex')


        var download = {
            id: id,
            size: size,
            status: STATUS_STARTING,
            audioOnly: audioOnly,
            metadata: metadata,
            targetFile: targetFile,
            progress: {
                start: new Date().getTime(),
                intervalStart: new Date().getTime(),
                position: 0,
                intervalPosition: 0,
                step: 0,
                percentage: 0,
                eta: null,
                speed: 0,
            }
        }

        CACHE[id] = download
        publish(download)

        return download
    },

    updateDownload: (id, chunkSize) => {

        let download = CACHE[id]
        let progress = download.progress

        ++progress.step
        progress.intervalPosition += chunkSize
        progress.position += chunkSize
        
        if (progress.step < STEP_THRESHOLD) {
            return
        }

        var intervalInSeconds = (new Date().getTime() - progress.intervalStart) / 1000
        progress.speed = progress.intervalPosition / intervalInSeconds

        progress.step = 0
        progress.intervalPosition = 0
        progress.intervalStart = new Date().getTime()

        if (download.size) {
            var durationInSeconds = (new Date().getTime() - progress.start) / 1000
            progress.percentage = progress.position / download.size
            progress.eta = durationInSeconds / progress.percentage - durationInSeconds
        }

        download.status = STATUS_IN_PROGRESS

        publish(download)
    },

    completedAndConvertingDownload: (id) => {
        let download = CACHE[id]
        download.status = STATUS_COMPLETE_CONVERTING

        publish(download)
    },

    finishDownload: (id, filename) => {
        let download = CACHE[id]
        download.status = STATUS_FINISHED
        
        download.progress.end = new Date().getTime()
        download.progress.duration = `${ (new Date().getTime() - download.progress.start) / 1000 }s`
        download.targetFile = filename
        download.progress.percentage = 100
        download.progress.eta = 0
        download.progress.position = null
        download.progress.speed = 0

        publish(download)

        delete CACHE[id]
    },

    downloadError: (id) => {
        let download = CACHE[id]
        download.status = STATUS_ERROR

        publish(download)
    },

    getAllDownloads: () => {
        return Object.values({
            ...CACHE
        })
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