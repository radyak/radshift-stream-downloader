const crypto = require('crypto')
const EventsService = require('./EventsService')


const CACHE = {}


const STATUS_STARTING = `STARTING`
const STATUS_IN_PROGRESS = `IN_PROGRESS`
const STATUS_ERROR = `ERROR`
const STATUS_COMPLETE_CONVERTING = `COMPLETE_CONVERTING`
const STATUS_FINISHED = `FINISHED`


function publish(download) {
    EventsService.emit(EventsService.EVENT_NAME, download)
}

module.exports = {

    addDownload: () => {
        var id = crypto.createHash('md5')
                       .update(new Date().toISOString())
                       .digest('hex')


        var download = {
            id: id,
            status: STATUS_STARTING
        }

        CACHE[id] = download
        publish(download)

        return download
    },


    /* DOWNLOADING:
        {
            status: 'downloading',
            downloaded_bytes: 3175612,
            total_bytes: 3175612,
            tmpfilename: 'CHVRCHES - Miracle (Official Video)-e1YqueG2gtQ.webm.part',
            filename: 'CHVRCHES - Miracle (Official Video)-e1YqueG2gtQ.webm',
            eta: 0,
            speed: 9905427.830759333,
            elapsed: 0.41184139251708984,
            _eta_str: '00:00',
            _percent_str: '100.0%',
            _speed_str: ' 9.45MiB/s',
            _total_bytes_str: '3.03MiB'
        }
    */
    updateDownload: (id, data) => {
        let download = CACHE[id]
        download = {
            ...download,
            ...data,
            status: STATUS_IN_PROGRESS
        }
        CACHE[id] = download

        publish(download)
    },


    /* FINISHED:
        {
            filename: 'CHVRCHES - Miracle (Official Video)-e1YqueG2gtQ.webm',
            status: 'finished',
            total_bytes: 3175612,
            _total_bytes_str: '3.03MiB'
        }
     */
    completedAndConvertingDownload: (id, data) => {
        let download = CACHE[id]
        download.status = STATUS_COMPLETE_CONVERTING

        publish(download)
    },

    
    finishDownload: (id) => {
        let download = CACHE[id]
        download.status = STATUS_FINISHED
        
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