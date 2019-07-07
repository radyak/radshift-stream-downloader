const fs = require('fs')
const crypto = require('crypto')
const youtubedl = require('youtube-dl')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')


const rootPath = process.cwd()


module.exports = {

    download: (url, options = {}) => {

        var format = options.format || 'mp3'
        var outputPath = options.outputPath || process.env.FFMPEG_PATH || path.join(rootPath, 'output')
        var ffmpegPath = process.env.FFMPEG_PATH || path.join(rootPath, 'ffmpeg-4.1.3-i686-static', 'ffmpeg')
        
        if (!fs.existsSync(outputPath)){
            fs.mkdirSync(outputPath);
        }

        var download = youtubedl(url, [], { cwd: __dirname })
        
        var size = 0
        var position = 0
        var now = new Date().toISOString()
        var id = crypto.createHash('md5').update(now).digest('hex')
        var tempFilename = `download-${now}.${format}`
        var tempFile = `./output/${tempFilename}`
        var finalFile

        download.on('info', function(info) {
            console.log('Download started', info)

            finalFile = `./output/${info.fulltitle}.${format}`
            size = info.size
        })
    
        download.on('data', function data(chunk) {
            position += chunk.length

            if (size) {
              var percent = position / size
              console.log(percent)
            }
        })

        download.on('complete', function complete(info) {
            console.log('filename: ' + info._filename + ' already downloaded.');
        });

        download.on('end', function() {
            console.log('finished downloading!');
        });

        download.on('error', function error(err) {
            console.log('error 2:', err);
        });
        

        // video.pipe(fs.createWriteStream(targetFile));
        
        ffmpeg({source: download})
            .setFfmpegPath('/home/fvo/private/dev/radshift/radshift-stream-downloader/ffmpeg-4.1.3-i686-static/ffmpeg')
            .saveToFile(tempFile, (stdout, stderr) => {
                console.log(stdout)
                console.error(stderr)
            })
            .on('end', function() {
                fs.rename(tempFile, finalFile, (err) => {
                    console.log(`File saved as ${finalFile}`)
                })
                console.log('Processing finished !');
            })
    
    }


}