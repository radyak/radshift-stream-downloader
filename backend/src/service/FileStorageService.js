const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')


const rootPath = process.cwd()
const outputPath = process.env.OUTPUT_PATH || path.join(rootPath, 'output')
const ffmpegPath = process.env.FFMPEG_PATH || path.join(rootPath, 'ffmpeg-4.1.3-i686-static', 'ffmpeg')




let getFilePath = (filename) => {
    const filepath = path.join(outputPath, filename)
    return fs.existsSync(filepath) ? filepath : null
}



module.exports = {

    getFiles: () => {
        try {
            const files = fs.readdirSync(outputPath, 'utf8');
            const result = [];
            for (let file of files) {
                const extension = path.extname(file)
                const fileStats = fs.statSync(path.join(outputPath, file))
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

    getFilePath: getFilePath,

    deleteFile: (filename) => {
        const filepath = getFilePath(filename)
        if (!filepath) {
            return null
        }
        fs.unlinkSync(filepath)
        return filepath
    },

    storeAs: (fileStream, fileName) => {

        if (!fs.existsSync(outputPath)){
            fs.mkdirSync(outputPath);
        }

        return new Promise((resolve, reject) => {

            var now = new Date().toISOString()
            var tempFile = path.join(outputPath, `download.${now}.${fileName}`)
            
            ffmpeg({source: fileStream})
                .setFfmpegPath(ffmpegPath)
                .saveToFile(tempFile, (stdout, stderr) => {
                    console.log(stdout)
                    console.error(stderr)
                })
                .on('end', function() {
                    fs.rename(tempFile, path.join(outputPath, fileName), (err) => {
                        if(err) {
                            console.error(`Could not rename ${tempFile} to ${fileName}`)
                            reject(err)
                            return
                        }
                        console.log(`File saved as ${fileName}`)
                        resolve(fileName)
                    })
                    console.log('Processing finished !');
                })

        })

    }
}