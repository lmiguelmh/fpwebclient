"use strict";

/**
 * @author lmiguelmh
 **/

const vars = require('./vars');
const messages = require('./messages');
const URIUtils = require('./URIUtils');
const Logger = require('./Logger');

class SimpleNativeApplication {
    constructor(onConnect, onMessage, onClose, onError) {
        if (onConnect === undefined) {
            throw Error("IllegalOnConnectArgumentException");
        }
        if (onMessage === undefined) {
            throw Error("IllegalOnResponseArgumentException");
        }
        if (onError === undefined) {
            throw Error("IllegalOnErrorArgumentException");
        }
        if (onClose === undefined) {
            throw Error("IllegalOnCloseArgumentException");
        }
        this.onConnect = onConnect;
        this.onMessage = onMessage;
        this.onError = onError;
        this.onClose = onClose;
    }

    processInput(input) {
        return input;
    }

    connect(localAppUrl) {
        try {
            const self = this;
            Logger.log(`connecting to: ${localAppUrl}`);
            let connection = new WebSocket(localAppUrl);
            connection.onopen = function (e) {
                Logger.log({'onopen': e});
                setTimeout(function () {
                    self.connection = connection;
                    self.onConnect && self.onConnect();
                }, 1);
            };
            connection.onmessage = function (e) {
                Logger.log({'onmessage': e});
                self.onMessage && self.onMessage(e.data);
            };
            connection.onerror = function (e) {
                Logger.log({'onerror': e});
                self.onError && self.onError(e);
            };
            connection.onclose = function (e) {
                Logger.log({'onclose': e});
                self.onClose && self.onClose(e);
            };
        } catch (e) {
            Logger.log({'catch': e});
            this.onError && this.onError(e);
        }
    }

    send(message) {
        if (this.connection === undefined) {
            throw Error("IllegalConnectionException");
        } else {
            this.connection.send(message);
        }
    }
}

module.exports = SimpleNativeApplication;