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
    
    download: (url, format_id) => {
        return youtubedl(
            url,
            [ `--format=${format_id}` ],
            { cwd: __dirname }
        )
    }
    
}