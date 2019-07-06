var YoutubeMp3Downloader = require("youtube-mp3-downloader");

const rootPath = process.cwd();

var YD = new YoutubeMp3Downloader({
    "ffmpegPath": process.env.FFMPEG_PATH || rootPath + "/ffmpeg-4.1.3-i686-static/ffmpeg",

    "outputPath": process.env.OUTPUT_PATH || rootPath + "/output",

    "youtubeVideoQuality": process.env.OUTPUT_QUALITY || "highest",

    "queueParallelism": process.env.PARALLEL_DOWNLOADS || 2,

    "progressTimeout": process.env.REPORT_INTERVAL || 2000
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


module.exports = {

    getSupportedSites: () => {
        return [
            'youtube'
        ];
    },

    download: (code) => {
        YD.download(code);
    }
}
