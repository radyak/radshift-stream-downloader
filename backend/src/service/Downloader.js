const ytdl = require('ytdl-core')


mod = (number, divisor) => {
    return Math.floor(number / divisor)
}


module.exports = {
    
    getInfo: (url) => {
        return ytdl.getInfo(url).then(info => {
            console.log('Raw info:', JSON.stringify(info))

            return {
                title: info.player_response.videoDetails.title,
                durationInSeconds: info.player_response.videoDetails.lengthSeconds,
                thumbnail: info.player_response.videoDetails.thumbnail.thumbnails.sort((a, b) => b.width - a.width)[0].url
            }
        })
    },
    
    download: (url, audioOnly) => {
        return ytdl(url, {
            // default: highest
            quality: audioOnly ? 'highestaudio' : 'highest',
        
            filter: audioOnly ? (format) => format.container === 'mp4' : null
            
        })
    }
    
}