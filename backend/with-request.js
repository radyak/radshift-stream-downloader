const request = require('request')
const fs = require('fs')

var out = fs.createWriteStream('download.mp4');

var length = 0;
var progress = 0;

var req = request({
    method: 'GET',
    uri: "https://r2---sn-h0jeln7l.googlevideo.com/videoplayback?expire=1579381721&ei=eR8jXoj6IcbD1wLp076AAg&ip=178.0.14.121&id=o-AL-nHGwGJx1Ge0-FkY4V9wTvCzir7P6a7u_Xf4t12uPQ&itag=22&source=youtube&requiressl=yes&mm=31%2C26&mn=sn-h0jeln7l%2Csn-4g5edns6&ms=au%2Conr&mv=m&mvi=1&pl=23&initcwndbps=1101250&vprv=1&mime=video%2Fmp4&ratebypass=yes&dur=155.318&lmt=1540230480221589&mt=1579360001&fvip=2&fexp=23842630&c=WEB&txp=5531432&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cvprv%2Cmime%2Cratebypass%2Cdur%2Clmt&sig=ALgxI2wwRAIgc_z1A71FbgOPNS5M2as-AToXreoAWQF2OsRo4_HgQykCIDfUusSlQ-afwWg3xwhzVi-gtsXEUluPIIO_Sk6hKyLH&lsparams=mm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AHylml4wRgIhAI6pcH9Ui5Da0pvQUOmbvqFvm-q695nT5vrPp90kgWhrAiEAm-rWXB2TqbhcdoKrf-Is-gOP_ACjbdg9lzrgxUJi7-I%3D"
});

req.pipe(out);

req.on('response', function (res) {
    console.log('Response:', res.statusCode)
    console.log('Length:', res.headers[ 'content-length' ])
    length = res.headers[ 'content-length' ]
});

req.on('data', function (chunk) {
    progress += chunk.length
    if (length) {
        console.log(`Progress: ${Math.round(progress/length * 100)}%`)
    }
});

req.on('end', function() {
    console.log('done!')
});