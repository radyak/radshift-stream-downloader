const fs = require('fs')
const path = require('path')


const rootPath = process.cwd()
// Should be the users' /home dir on the host (usually /var/rs-root/home)
const basePath = process.env.OUTPUT_PATH || path.join(rootPath, 'output')





let getUserMediaDirectory = (isAudio, username = 'shared') => {
    let mediaSubpath = isAudio ? 'Audio' : 'Video'
    let userSubpath = username
    let storagePath = `${basePath}/${userSubpath}/files/${mediaSubpath}`
    return storagePath
}

let getStoragePath = (isAudio, username, mediaDirectory = 'Downloads') => {
    let userMediaDirectory = getUserMediaDirectory(isAudio, username)
    return `${userMediaDirectory}/${mediaDirectory}`
}

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

    getMediaDirectories: (isAudio, username) => {
        const userMediaDirectory = getUserMediaDirectory(isAudio, username)
        try {
            return fs.readdirSync(userMediaDirectory, 'utf8');
        } catch (e) {
            console.error(e)
            return []
        }
    },

    getStoragePath: getStoragePath,

    getFilePath: getFilePath,

    deleteFile: (filename, isAudio, username) => {
        const filepath = getFilePath(filename, isAudio, username)
        if (!filepath) {
            return null
        }
        fs.unlinkSync(filepath)
        return filepath
    }

}