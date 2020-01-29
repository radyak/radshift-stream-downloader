const youtubedl = require('youtube-dl')




module.exports = {
    
    getInfo: (url) => {
        return new Promise((resolve, reject) => {
            youtubedl.getInfo(url, [], (err, info) => {
                if (err) {
                    reject(err)
                    return
                }

                resolve(info)
            })
        })
    },

    getExtractors: () => {
        return new Promise((resolve, reject) => {
            youtubedl.getExtractors(true, (err, extractors) => {
                if (err) {
                    return reject(err)
                }
                resolve(extractors)
            })
        })
    },
    
    download: (url, audioOnly) => {
        let options = []
        
        options.push(`--format=${audioOnly ? 'bestaudio' : 'best'}`)
        if (audioOnly) {
            options.push(`-x`)
            options.push(`--audio-format=mp3`)
        }
        return youtubedl(
            url,
            options,
            { cwd: __dirname }
        )
    }
    
}