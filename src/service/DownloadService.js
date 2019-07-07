const fs = require('fs')
const crypto = require('crypto')
const youtubedl = require('youtube-dl')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const EventEmitter = require('events')
 

const eventEmitter = new EventEmitter()
const rootPath = process.cwd()



class DownloadEvents {
    constructor(downloadId, downloadMetadata) {

        this.onSubscribe = (handler) => {
            handler({
                ...downloadMetadata,
                type: `subscribe`
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


module.exports = {

    download: (url, options = {}) => {

        var format = options.format || 'mp3'
        var outputPath = options.outputPath || process.env.FFMPEG_PATH || path.join(rootPath, 'output')
        var ffmpegPath = process.env.FFMPEG_PATH || path.join(rootPath, 'ffmpeg-4.1.3-i686-static', 'ffmpeg')
        
        if (!fs.existsSync(outputPath)){
            fs.mkdirSync(outputPath);
        }

        var download = youtubedl(url, [], { cwd: __dirname })
        
        var size = 0
        var position = 0
        var now = new Date().toISOString()
        var id = crypto.createHash('md5').update(now).digest('hex')
        var tempFilename = `download-${now}.${format}`
        var tempFile = path.join(outputPath, tempFilename)
        var finalFile
        var metadata

        download.on('info', function(info) {
            metadata = {
                download: id,
                start: new Date().toISOString(),

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
                size: info.size,
                
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

            eventEmitter.emit(`start`, {
                ...metadata,
                type: 'started'
            })

            finalFile = `./output/${info.fulltitle}.${format}`
            size = info.size
        })
    
        download.on('data', function data(chunk) {
            position += chunk.length

            if (size) {
              var percent = position / size
              var event = {
                  type: 'progress',
                  progress: percent
              }
              eventEmitter.emit(`progress-${id}`, event)
              eventEmitter.emit(`progress`, event)
            }

        })

        download.on('error', function error(err) {
            var event = {
                type: 'error',
                error: err
            }
            eventEmitter.emit(`error-${id}`, event)
            eventEmitter.emit(`error`, event)
        });
        
        
        ffmpeg({source: download})
            .setFfmpegPath(ffmpegPath)
            .saveToFile(tempFile, (stdout, stderr) => {
                console.log(stdout)
                console.error(stderr)
            })
            .on('end', function() {
                fs.rename(tempFile, finalFile, (err) => {
                    if(err) {
                        
                        return
                    }
                    console.log(`File saved as ${finalFile}`)

                    var event = {
                        type: 'finished',
                        // TODO: Remove later!
                        filename: finalFile
                    }
                    eventEmitter.emit(`finished-${id}`, event)
                    eventEmitter.emit(`finished`, event)
                })
                console.log('Processing finished !');
            })


        return new DownloadEvents(id, metadata)
    
    }


}