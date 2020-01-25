const YoutubeDlWrapper = require('./YoutubeDlWrapper')
const FileStorageService = require('./FileStorageService')
const DownloadCache = require('./DownloadCache')
const NodeID3 = require('node-id3')
const request = require('request')


const downloadWithMetaData = (url, metadata, audioOnly, username = 'shared') => {
    
    console.log('url:', url)
    console.log('metadata:', metadata)


    console.log(`Downloading video ${url} from ${metadata.url}`)

    let filename = metadata.fulltitle.replace(/[/.]+/g, '-')
    let extension = audioOnly ? 'mp3' : 'mp4'
    let targetFile = `${filename}.${extension}`
    var downloadStart = new Date().getTime()
    let size = metadata.size || metadata.filesize


    var downloadStream = YoutubeDlWrapper.download(url, metadata.format_id)
    let download = DownloadCache.addDownload(metadata, audioOnly, size, targetFile)

    downloadStream.on('data', function data(chunk) {
        DownloadCache.updateDownload(download.id, chunk.length)
    })

    downloadStream.on('complete', function error(err) {
        DownloadCache.completedAndConvertingDownload(download.id)
    });

    downloadStream.on('error', function error(err) {
        DownloadCache.downloadError(download.id)
    });
    
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
                   .get(metadata.thumbnail, (err, res, buffer) => {
                        if (err) {
                            console.error('Could not fetch image as buffer')
                        }
                        let tags = {
                            title: metadata.alt_title || metadata.track || metadata.fulltitle,
                            artist: metadata.artist,
                            album: metadata.album,
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

    return download

}


module.exports = {

    startDownload: (url, option, audioOnly, username = 'shared') => {
        return downloadWithMetaData(url, option, audioOnly, username)
    },

    getSupportedStreams: () => {
        return YoutubeDlWrapper.getExtractors()
    },

    getAllDownloads: () => {
        return DownloadCache.getAllDownloads()
    }

}