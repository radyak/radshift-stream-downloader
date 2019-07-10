const crypto = require('crypto')
const youtubedl = require('youtube-dl')
const EventEmitter = require('events')
const FileStorageService = require('./FileStorageService')


const eventEmitter = new EventEmitter()


class DownloadEvents {
    constructor(downloadId, downloadMetadata) {

        this.onSubscribe = (handler) => {
            handler({
                ...downloadMetadata
            })
        }

        this.onProgress = (handler) => {
            eventEmitter.on(`progress-${downloadId}`, (event) => {
                handler(event)
            })
        }

        this.onError = (handler) => {
            eventEmitter.on(`error-${downloadId}`, (event) => {
                handler({
                    ...event,
                    message: `An error occurred while downloading video ${downloadId}`
                })
            })
        }

        this.onFinished = (handler) => {
            eventEmitter.on(`finished-${downloadId}`, (event) => {
                handler({
                    ...event,
                    message: `Finished downloading video ${downloadId}`
                })
            })
        }
    }
}


const getInfo = (url) => {

    return new Promise((resolve, reject) => {
        youtubedl.getInfo(url, [], function(err, info) {
            if (err) {
                reject(err)
                return
            }
            
            var metadata = {
                // youtube-dl metadata
                extractor_key: info.extractor_key,
                extractor: info.extractor,
                webpage_url: info.webpage_url,
                average_rating: info.average_rating,
                view_count: info.view_count,
                channel_url: info.channel_url,
                
                // file metadata
                width: info.width,
                duration: info.duration,
                height: info.height,
                resolution: info.resolution,
                format_id: info.format_id,
                size: info.filesize,
                
                // content metadata
                artist: info.artist,
                alt_title: info.alt_title,
                creator: info.creator,
                fulltitle: info.fulltitle,
                album: info.album,
                description: info.description,
                track: info.track,
                thumbnail: info.thumbnail,
            }

            console.log(metadata)

            resolve(metadata)
        });
    })

}


const downloadWithMetaData = (url, metadata, options = {}) => {

    console.log(`Downloading from ${url}`)

    var download = youtubedl(url, [], { cwd: __dirname })
    
    var format = options.format || 'mp3'
    var size = metadata.size
    var position = 0
    var now = new Date().toISOString()
    var id = crypto.createHash('md5').update(now).digest('hex')
    var targetFile = `${metadata.fulltitle}.${format}`

    metadata = {
        ...metadata,
        download: id,
        start: new Date().toISOString()
    }

    eventEmitter.emit(`start`, {
        ...metadata
    })

    download.on('data', function data(chunk) {
        position += chunk.length

        if (size) {
          var percentage = position / size
          var event = {
              progress: percentage
          }
          eventEmitter.emit(`progress-${id}`, event)
          eventEmitter.emit(`progress`, event)
        }

    })

    download.on('error', function error(err) {
        console.log(`error`)
        var event = {
            error: err
        }
        eventEmitter.emit(`error-${id}`, event)
        eventEmitter.emit(`error`, event)
    });
    
    FileStorageService.storeAs(download, targetFile).then(finalFile => {
        var event = {
            filename: finalFile
        }
        eventEmitter.emit(`finished-${id}`, event)
        eventEmitter.emit(`finished`, event)
    })

    return new DownloadEvents(id, metadata)
}


module.exports = {

    download: (url, options) => {
        return getInfo(url)
            .then(info => {
                return downloadWithMetaData(url, info, options)
            })
            .catch(err => {
                console.error('An error occurred', err)
            })
    },

    getSupportedStreams: () => {
        return new Promise((resolve, reject) => {
            youtubedl.getExtractors(true, (err, extractors) => {
                if (err) {
                    return reject(err)
                }
                resolve(extractors)
            })
        })
    }

}