var YoutubeMp3Downloader = require("youtube-mp3-downloader");
 
//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": "/home/fvo/private/dev/radshift/youtube-dl/ffmpeg-4.1.3-i686-static/ffmpeg",        // Where is the FFmpeg binary located?
    "outputPath": "/home/fvo/private/dev/radshift/youtube-dl/output",    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});
 
 
YD.on("finished", function(err, data) {
    console.log(JSON.stringify(data));
    // Example: {"videoId":"Jmtte8urjFk","stats":{"transferredBytes":261227940,"runtime":154,"averageSpeed":1685341.55},"file":"/home/fvo/private/dev/radshift/youtube-dl/output/Die großen Mythen - Athene | ARTE.mp3","youtubeUrl":"http://www.youtube.com/watch?v=Jmtte8urjFk","videoTitle":"Die großen Mythen - Athene | ARTE","artist":"Die großen Mythen","title":"Athene | ARTE","thumbnail":null}
});
 
YD.on("error", function(error) {
    console.log(error);
});
 
YD.on("progress", function(progress) {
    console.log(JSON.stringify(progress));
    // Example: {"videoId":"Jmtte8urjFk","progress":{"percentage":98.70355483414217,"transferred":257841263,"length":261227940,"remaining":3386677,"eta":2,"runtime":152,"delta":3495266,"speed":1685237.0130718953}}
});

module.exports = (code) => {
    // Download video and save as MP3 file
    // "Jmtte8urjFk"
    YD.download(code);
};