const YoutubeDlWrapper = require('./YoutubeDlWrapper')
const FileStorageService = require('./FileStorageService')
const DownloadCache = require('./DownloadCache')
const NodeID3 = require('node-id3')
const request = require('request')

const OptionFilterService = require('./OptionFilterService')


const getBestOption = (videoInfo, audioOnly) => {

        let bestOption = OptionFilterService.filterBestOption(videoInfo.formats, audioOnly);

        var metadata = {
            // youtube-dl metadata
            extractor_key: videoInfo.extractor_key,
            extractor: videoInfo.extractor,
            webpage_url: videoInfo.webpage_url,
            average_rating: videoInfo.average_rating,
            view_count: videoInfo.view_count,
            channel_url: videoInfo.channel_url,
            
            // file metadata
            width: bestOption.width,
            duration: videoInfo.duration,
            height: bestOption.height,
            format_id: bestOption.format_id,
            size: bestOption.filesize || bestOption.size,
            
            // content metadata
            artist: videoInfo.artist,
            alt_title: videoInfo.alt_title,
            creator: videoInfo.creator,
            fulltitle: videoInfo.fulltitle,
            album: videoInfo.album,
            description: videoInfo.description,
            track: videoInfo.track,
            thumbnail: videoInfo.thumbnail,
        }

        console.log('Best Option Metadata:', metadata)

        return metadata

}


const downloadWithMetaData = (url, metadata, audioOnly, username = 'shared') => {

    console.log(`Downloading from ${url}`)

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
        return YoutubeDlWrapper.getInfo(url)
            .then((info) => getBestOption(info, audioOnly))
            .then(bestOption => {
                return downloadWithMetaData(url, bestOption, audioOnly, username)
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