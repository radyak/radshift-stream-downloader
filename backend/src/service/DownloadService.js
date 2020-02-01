const YoutubeDlWrapper = require('./YoutubeDlWrapper')
const FileStorageService = require('./FileStorageService')
const DownloadCache = require('./DownloadCache')


const download = (url, audioOnly, username = 'shared') => {
    
    console.log(`Downloading video ${url}`)

    // TODO: Fix user-specific output
    var targetDir = FileStorageService.getStoragePath(audioOnly, username)
    var downloadStream = YoutubeDlWrapper.download(url, targetDir, audioOnly)
    let download = DownloadCache.addDownload()

    downloadStream.on('progress', (data) => {
        DownloadCache.updateDownload(download.id, data)
    })

    downloadStream.on('complete', (data) => {
        DownloadCache.completedAndConvertingDownload(download.id, data)
    })

    downloadStream.on('finished', () => {
        DownloadCache.finishDownload(download.id)
    })
    
    downloadStream.on('error', (error) => {
        console.error('An error occurred', error)
        DownloadCache.downloadError(download.id)
    })
    

    return download

}


module.exports = {

    startDownload: download,

    getSupportedStreams: () => {
        return YoutubeDlWrapper.getExtractors()
    },

    getAllDownloads: () => {
        return DownloadCache.getAllDownloads()
    }

}