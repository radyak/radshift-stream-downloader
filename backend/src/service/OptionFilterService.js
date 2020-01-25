const resolution = (file) => file.width * file.height

const descendingOrder = (fileA, fileB) => {
    if (resolution(fileA) && resolution(fileB)) {
        return resolution(fileB) - resolution(fileA)
    }
    if (fileA.size && fileB.size) {
        return fileB.size - fileA.size
    }
    if (fileA.filesize && fileB.filesize) {
        return fileB.filesize - fileA.filesize
    }
    if (fileA.format_note && fileB.format_note) {
        return parseInt(fileB.format_note) - parseInt(fileA.format_note)
    }
    if (fileA.tbr && fileB.tbr) {
        return parseInt(fileB.tbr) - parseInt(fileA.tbr)
    }
    return 0
}

const ascendingOrder = (fileA, fileB) => {
    return descendingOrder(fileA, fileB) * (-1)
}

const filterBestOption = (options, isForAudioDownload) => {

    let bestOptions

    console.log('Raw options:', JSON.stringify(options))

    if (isForAudioDownload) {
        // Best Option for Audio: format_note 'tiny' and smallest file (quality remains the same anyway)
        bestOptions = options
            .filter(option => option.acodec !== 'none')
            .filter(option => option.format_note === 'tiny' || (!option.width && !option.height))
            .sort(ascendingOrder)
    } else {
        // Best Option for Audio: extension 'mp4' and biggest files / best quality
        bestOptions = options
            .filter(option => option.acodec !== 'none')
            .filter(option => option.ext === 'mp4')
            .filter(option => {
                let format = option.format_note || option.format || option.format_id
                return format !== 'tiny' && parseInt(format) <= 1080
            })
            .sort(descendingOrder)
    }

    console.log('Best option:', JSON.stringify(bestOptions[0]))

    return bestOptions ? bestOptions[0] : null;

}

module.exports = {
    filterBestOption: filterBestOption
}