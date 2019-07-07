var fs = require('fs');
var youtubedl = require('youtube-dl');

var ffmpeg = require('fluent-ffmpeg')

// module.exports = (code) => {
//     var video = youtubedl(`https://www.youtube.com/watch?v=${code}`,
//     // Optional arguments passed to youtube-dl.
//     ['--format=18'],
//     // Additional options can be given for calling `child_process.execFile()`.
//     { cwd: __dirname });
    
//     // Will be called when the download starts.
//     video.on('info', function(info) {
//     console.log('Download started');
//     console.log('filename: ' + info._filename);
//     console.log('size: ' + info.size);
//     });
    
//     video.pipe(fs.createWriteStream('myvideo.mp4'));
// }

module.exports = (code) => {
    var video = youtubedl(`https://www.youtube.com/watch?v=${code}`,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });
    
    var size = 0;
    // Will be called when the download starts.
    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
        size = info.size;
    });

    var pos = 0;
    video.on('data', function data(chunk) {
        pos += chunk.length;
        // `size` should not be 0 here.
        if (size) {
          var percent = pos / size;
          console.log(percent);
        }
      });
    
    var proc = new ffmpeg({source: video})
    proc.setFfmpegPath('/home/fvo/private/dev/radshift/radshift-stream-downloader/ffmpeg-4.1.3-i686-static/ffmpeg')
    proc.saveToFile('./audio.mp3', (stdout, stderr) => {
        console.log(stdout)
        console.error(stderr)
    })
    // video.pipe(fs.createWriteStream('myvideo.mp4'));

}