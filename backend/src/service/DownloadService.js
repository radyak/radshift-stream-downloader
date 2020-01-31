const YoutubeDlWrapper = require('./YoutubeDlWrapper')
const FileStorageService = require('./FileStorageService')
const DownloadCache = require('./DownloadCache')


const download = (url, audioOnly, username = 'shared') => {
    
    console.log(`Downloading video ${url}`)

    var downloadStream = YoutubeDlWrapper.download(url, audioOnly)
    let download = DownloadCache.addDownload()

    downloadStream.on('downloading', (data) => {
        DownloadCache.updateDownload(download.id, data)
    })

    downloadStream.on('complete', (data) => {
        DownloadCache.completedAndConvertingDownload(download.id, data)
    });

    downloadStream.on('finished', () => {
        DownloadCache.finishDownload(download.id)
        // FileStorageService.storeAs(downloadStream, targetFile, audioOnly, username)
    });
    
    downloadStream.on('error', (error) => {
        console.error('An error occurred', error)
        DownloadCache.downloadError(download.id)
    });
    

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