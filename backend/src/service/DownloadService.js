const YoutubeDlWrapper = require('./YoutubeDlWrapper')
const FileStorageService = require('./FileStorageService')
const DownloadCache = require('./DownloadCache')
const NodeID3 = require('node-id3')
const request = require('request')


const download = (url, audioOnly, username = 'shared') => {
    
    console.log(`Downloading video ${url}`)

    let size = 0

    var downloadStream = YoutubeDlWrapper.download(url, audioOnly)
    let download

    downloadStream.on('data', (chunk) => {
        DownloadCache.updateDownload(download.id, chunk.length)
    })

    downloadStream.on('info', (info) => {
        console.log('Received info:', info)
        
        size = info.size || info.filesize

        download = DownloadCache.addDownload(info, audioOnly, size)

        let filename = info.fulltitle.replace(/[/.]+/g, '-'),
            extension = audioOnly ? 'mp3' : 'mp4',
            targetFile = `${filename}.${extension}`,
            downloadStart = new Date().getTime()

        FileStorageService.storeAs(downloadStream, targetFile, audioOnly, username)
            .then(storedFile => {

                var downloadEnd = new Date().getTime()
                var data = {
                    filename: storedFile.name,
                    end: downloadEnd,
                    duration: `${ (downloadEnd - downloadStart) / 1000 }s`
                }
                DownloadCache.finishDownload(download.id, data)

                return storedFile.fullpath
            })

            .then(filePath => {

                if (!audioOnly) {
                    // Exit; no tags for videos
                    return
                }

                request.defaults({ encoding: null })
                    .get(info.thumbnail, (err, res, buffer) => {
                            if (err) {
                                console.error('Could not fetch image as buffer')
                            }
                            let tags = {
                                title: info.alt_title || info.track || info.fulltitle,
                                artist: info.artist,
                                album: info.album,
                                image: {
                                    imageBuffer: buffer
                                }
                            }

                            let success = NodeID3.write(tags, filePath)
                            
                            console.log(success ? 'File tagged' : 'Could not tag file')
                        })
            })

            .catch(error => {
                console.error(`Error while saving file ${targetFile}:`, error)
                DownloadCache.downloadError(download.id)
            })

    })

    downloadStream.on('complete', () => {
        DownloadCache.completedAndConvertingDownload(download.id)
    });

    downloadStream.on('error', (error) => {
        console.error('An error occurred', error)
        DownloadCache.downloadError(download.id)
    });
    

    return download

}


module.exports = {

    startDownload: (url, audioOnly, username = 'shared') => {
        return download(url, audioOnly, username)
    },

    getSupportedStreams: () => {
        return YoutubeDlWrapper.getExtractors()
    },

    getAllDownloads: () => {
        return DownloadCache.getAllDownloads()
    }

}