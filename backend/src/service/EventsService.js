const EventEmitter = require('events')

const eventEmitter = new EventEmitter()

module.exports = {

    EVENT_NAME: 'update',

    on: (eventName, eventCallback) => {
        eventEmitter.on(eventName, eventCallback)
    },

    emit: (eventName, eventData) => {
        eventEmitter.emit(eventName, eventData)
    },

    remove: (eventName, eventCallback) => {
        eventEmitter.removeListener(eventName, eventCallback)
    },

}