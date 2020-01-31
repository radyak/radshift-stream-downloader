const fs = require('fs')
const path = require('path')


const rootPath = process.cwd()
// Should be the users' /home dir on the host (usually /var/rs-root/home)
const basePath = process.env.OUTPUT_PATH || path.join(rootPath, 'output')




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
    let mediaSubpath = isAudio ? 'Audio' : 'Video'
    let userSubpath = username || 'shared'
    let storagePath = `${basePath}/${userSubpath}/files/${mediaSubpath}/Downloads`
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

        var now = new Date().toISOString()
        var tempFile = path.join(storagePath, `download.${now}.${fileName}`)
        
        return new Promise((resolve, reject) => {

            let onFinish = () => {
                var finalFilePath = path.join(storagePath, fileName)
                fs.rename(tempFile, finalFilePath, (err) => {
                    if(err) {
                        console.error(`Could not rename ${tempFile} to ${fileName}`)
                        reject(err)
                        return
                    }
                    console.log(`File saved as ${fileName}`)
                    resolve({
                        name: fileName,
                        fullpath: finalFilePath
                    })
                })
                console.log('Processing finished !');
            },

            onError = (error) => {
                console.error('An error occurred while persisting video data:', error)
                reject(error)
            }

        })

    }
}