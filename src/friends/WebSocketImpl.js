var EventEmitter = require('EventEmitter');

class WebSocketImpl extends WebSocket {

    constructor(url, protocols) {
        super(url, protocols);
        this._emitter = new EventEmitter();
    }

    addEventListener(eventType, listener) {
        return this._emitter.addListener(eventType, listener);
    }

    onopen() {
        this._emitter.emit('open', {});
    }

    onmessage(event) {
        this._emitter.emit('message', event);
    }

    onclose(event) {
        this._emitter.emit('close', event);
    }

    onerror(error) {
        this._emitter.emit('error', error);
    }
}

module.exports = WebSocketImpl;
