const YoutubeDlWrapper = require('./YoutubeDlWrapper')
const FileStorageService = require('./FileStorageService')
const DownloadCache = require('./DownloadCache')
const NodeID3 = require('node-id3')
const request = require('request')

const sortByFilesizeDesc = (fileA, fileB) => fileA.filesize - fileB.filesize

const getBestOption = (url, audioOnly) => {

    return YoutubeDlWrapper.getInfo(url)
        .then(info => {

            let bestOption = filterBestOption(info.formats, audioOnly);

            var metadata = {
                // youtube-dl metadata
                extractor_key: info.extractor_key,
                extractor: info.extractor,
                webpage_url: info.webpage_url,
                average_rating: info.average_rating,
                view_count: info.view_count,
                channel_url: info.channel_url,
                
                // file metadata
                width: bestOption.width,
                duration: info.duration,
                height: bestOption.height,
                format_id: bestOption.format_id,
                size: bestOption.filesize,
                
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

            console.log('Best Option Metadata:', metadata)

            return metadata
        })

}

const filterBestOption = (options, isForAudioDownload) => {

    let bestOptions

    if (isForAudioDownload) {
        // Best Option for Audio: format_note 'tiny' and smallest file (quality remains the same anyway)
        bestOptions = options
            .filter(format => format.acodec !== 'none')
            .filter((format => 
                format.format_note === 'tiny'
                || (format.width === null && format.height === null)
            ))
            .sort(sortByFilesizeDesc)
    } else {
        // Best Option for Audio: extension 'mp4' and biggest files / best quality
        bestOptions = options
            .filter(format => format.ext === 'mp4')
            .filter(format => format.acodec !== 'none')
            .sort(sortByFilesizeDesc)
    }

    return bestOptions ? bestOptions[0] : null;

}


const downloadWithMetaData = (url, metadata, audioOnly, username = 'shared') => {

    console.log(`Downloading from ${url}`)

    var downloadStream = YoutubeDlWrapper.download(url, metadata.format_id)

    let download = DownloadCache.addDownload(metadata, audioOnly)

    var size = download.metadata.size
    var targetFile = download.targetFile
    var downloadStart = download.progress.start
    var position = download.progress.position

    var step = 0,
        intervalPosition = 0,
        intervalStart = new Date().getTime()
    const stepThreshold = 10

    downloadStream.on('data', function data(chunk) {

        ++step
        intervalPosition += chunk.length
        position += chunk.length
        

        if (step < stepThreshold) {
            return
        }

        var intervalEnd = new Date().getTime()
        var intervalInSeconds = (intervalEnd - intervalStart) / 1000
        var speed = intervalPosition / intervalInSeconds

        step = 0
        intervalPosition = 0
        intervalStart = new Date().getTime()

        if (size) {
            var durationInSeconds = (new Date().getTime() - downloadStart) / 1000
            var percentage = position / size

            var eta = durationInSeconds / percentage - durationInSeconds

            DownloadCache.updateDownload(download.id, {
                percentage: Math.round(percentage * 100),
                eta: eta,
                position: position,
                speed: speed
            })
        }

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
        .catch(error => {
            console.error(`Error while saving file ${targetFile}:`, error)
            DownloadCache.downloadError(download.id)
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

    return download

}


module.exports = {

    startDownload: (url, audioOnly, username = 'shared') => {
        return getBestOption(url, audioOnly)
            .then(metadata => {
                return downloadWithMetaData(url, metadata, audioOnly, username)
            })
            .catch(err => {
                console.error('An error occurred', err)
            })
    },

    getSupportedStreams: () => {
        return YoutubeDlWrapper.getExtractors()
    },

    getAllDownloads: () => {
        return DownloadCache.getAllDownloads()
    }

}