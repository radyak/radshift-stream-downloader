const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg')

// ytdl.getInfo('https://www.youtube.com/watch?v=AvFl6UBZLv4').then(info => {
//     console.log('info:', info)
// })

// return


const download = ytdl('https://www.youtube.com/watch?v=AvFl6UBZLv4', {
    quality: 'highest',     // default: highest

    // filter: 'audioandvideo',
    filter: (format) => format.container === 'mp4'
})

.on('progress', evt => console.log('progress:', evt))

// Video:
.pipe(fs.createWriteStream('video.mp4'))


// Audio:
// const proc = new ffmpeg({source:download})
// proc.setFfmpegPath('./ffmpeg-i686-static/ffmpeg')
// proc.saveToFile('download.mp3', (data, err) => {
//     console.log('data:', data)
//     console.log('err:', err)
// })