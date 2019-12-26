const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')


const rootPath = process.cwd()
// Should be the users' /home dir on the host (usually /var/rs-root/home)
const basePath = process.env.OUTPUT_PATH || path.join(rootPath, 'output')
const ffmpegPath = process.env.FFMPEG_PATH || path.join(rootPath, 'ffmpeg-4.1.3-i686-static', 'ffmpeg')




let getFilePath = (filename, username) => {
    let storagePath = getStoragePath(true, username)
    let filepath = path.join(storagePath, filename)
    if (fs.existsSync(filepath)) {
        return filepath
    }

    storagePath = getStoragePath(false, username)
    filepath = path.join(storagePath, filename)
    if (fs.existsSync(filepath)) {
        return filepath
    }
    return null
}

let getStoragePath = (isAudio, username) => {
    let mediaSubpath = isAudio ? 'audio' : 'video'
    let userSubpath = username || 'shared'
    let storagePath = `${basePath}/${userSubpath}/media/${mediaSubpath}`
    return storagePath
}



module.exports = {

    getFiles: (isAudio, username) => {
        const storagePath = getStoragePath(isAudio, username)
        try {
            const files = fs.readdirSync(storagePath, 'utf8');
            const result = [];
            for (let file of files) {
                const extension = path.extname(file)
                const fileStats = fs.statSync(path.join(storagePath, file))
                result.push({
                    name: file,
                    extension: extension.replace(/\./i, ''),
                    sizeInBytes: fileStats.size,
                    createdAt: fileStats.birthtime,
                })
            }
            return result
        } catch (e) {
            console.error(e)
            return []
        }
    },

    getFilePath: getFilePath,

    deleteFile: (filename, isAudio, username) => {
        const filepath = getFilePath(filename, isAudio, username)
        if (!filepath) {
            return null
        }
        fs.unlinkSync(filepath)
        return filepath
    },

    storeAs: (fileStream, fileName, isAudio, username) => {

        let storagePath = getStoragePath(isAudio, username)
        if (!fs.existsSync(storagePath)){
            fs.mkdirSync(storagePath, { recursive: true });
        }

        return new Promise((resolve, reject) => {

            var now = new Date().toISOString()
            var tempFile = path.join(storagePath, `download.${now}.${fileName}`)
            
            // TODO: Use other API calls https://www.npmjs.com/package/fluent-ffmpeg/v/1.7.0
            ffmpeg({source: fileStream})
                .setFfmpegPath(ffmpegPath)
                .saveToFile(tempFile, (stdout, stderr) => {
                    console.log(stdout)
                    console.error(stderr)
                })
                .on('end', function() {
                    fs.rename(tempFile, path.join(storagePath, fileName), (err) => {
                        if(err) {
                            console.error(`Could not rename ${tempFile} to ${fileName}`)
                            reject(err)
                            return
                        }
                        console.log(`File saved as ${fileName}`)
                        resolve(fileName)
                    })
                    console.log('Processing finished !');
                })
                .on('error', function(error) {
                    console.error('An error occurred while persisting video data:', error)
                    reject(error)
                })

        })

    }
}