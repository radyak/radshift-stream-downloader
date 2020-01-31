const spawn = require("child_process").spawn;
const EventEmitter = require("events");


const eventMap = {
    "downloading": "progress",
    "finished": "complete"
}


const toJson = (str) => {
    let lines = str.split("\n")
    let content = lines.find(line => line.startsWith("{"))
    if (content) {
        return JSON.parse(content)
    }
    return null
}


module.exports = {

    getInfo: (url) => {

        return new Promise((resolve, reject) => {
            const pythonProcess = spawn("python", ["./src/python/info.py", url]);
            pythonProcess.stdout.on("data", (outputBuffer) => {
                let event = toJson(outputBuffer.toString())
                if (event) {
                    resolve(event)
                }
            })
        })

    },

    getExtractors: () => {
        return new Promise((resolve, reject) => {
            resolve(null)
        })
    },

    download: (url, audioOnly = false) => {

        const eventEmitter = new EventEmitter();

        /* 
        TODO:   1. options
                Call with 
                    --format=...
                    -x
                    --audio-format=mp3
                etc.?

                2. cwd?
        */
        const pythonProcess = spawn("python", ["./src/python/download.py", url, (audioOnly ? "True" : "False") ]);

        pythonProcess.stdout.on("data", (outputBuffer) => {
            let str = outputBuffer.toString()
            let event = toJson(str)
            if (event) {
                eventEmitter.emit(eventMap[event.status] || event.status, event)
            }
        })

        pythonProcess.on("exit", (code, signal) => {
            eventEmitter.emit("finished")
        })

        return {
            on: (eventName, callback) => eventEmitter.on(eventName, callback)
        };
    }

}

// YoutubeDlWrapper.getInfo("https://www.youtube.com/watch?v=6JK5-IyZlDc").then(info => {
//     console.log("Info:", info)
// })

// const download = YoutubeDlWrapper.download("https://www.youtube.com/watch?v=6JK5-IyZlDc")

// download.on("downloading", (data) => {
//     console.log("downloading:", data, "\n\n")
// })
// download.on("finished", (data) => {
//     console.log("finished:", data, "\n\n")
// })
