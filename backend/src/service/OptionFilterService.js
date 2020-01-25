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

const allHaveAttribute = (options, attributeName) => {
    for (option of options) {
        if (option[attributeName]) {
            return false
        }
    }
    return true
}

const filterBestOption = (options, isForAudioDownload) => {

    let rankedOptions = options

    console.log('Raw options:', JSON.stringify(options))

    if (isForAudioDownload) {
        // Best Option for Audio: format_note 'tiny' and smallest file (quality remains the same anyway)
        rankedOptions = options
            .filter(option => option.acodec !== 'none')
            .filter(option => option.format_note === 'tiny' || (!option.width && !option.height))
            .sort(ascendingOrder)
    } else {
        // Best Option for Audio: extension 'mp4' and biggest files / best quality
        rankedOptions = options
            .filter(option => option.acodec !== 'none')
            .filter(option => option.ext === 'mp4')
            .filter(option => option.format_note !== 'tiny' && option.format !== 'tiny' && option.format_id !== 'tiny')
            .sort(descendingOrder)
    }

    console.log('Best option:', JSON.stringify(rankedOptions[0]))

    return rankedOptions ? rankedOptions[0] : null;

}

module.exports = {
    filterBestOption: filterBestOption
}