"use strict";

/**
 * @author lmiguelmh
 **/

const vars = require('./vars');
const messages = require('./messages');
const URIUtils = require('./URIUtils');
const Logger = require('./Logger');

class NativeApplication {
    constructor(onConnect, onMessage, onError) {
        if (onConnect === undefined) {
            throw new Error("IllegalOnConnectArgumentException");
        }
        if (onMessage === undefined) {
            throw new Error("IllegalOnResponseArgumentException");
        }
        if (onError === undefined) {
            throw new Error("IllegalOnErrorArgumentException");
        }
        // onConnect will be called after handshake (receiving DesktopHello and sending WebHello)
        this.onConnect = onConnect;
        this.onMessage = onMessage;
        this.onError = onError;
        this.connection = undefined;
    }

    processInput(args) {
        let launcherArgs = args;
        // launcherArgs.port
        if (!Number.isInteger(launcherArgs.port)) {
            throw new Error("IllegalPortArgumentException");
        }
        if (launcherArgs.port <= 1024 || launcherArgs.port > 65536) {
            throw new Error("IllegalPortArgumentException");
        }
        // launcherArgs.timeout
        if (!Number.isInteger(launcherArgs.timeout)) {
            throw new Error("IllegalTimeoutArgumentException");
        }
        if (launcherArgs.timeout < 0 || launcherArgs.timeout > 60000) {
            throw new Error("IllegalTimeoutArgumentException");
        }
        return args;
    }

    connect(args, connectStartTime) {
        let launcherArgs = this.processInput(args);
        if ((new Date).getTime() > connectStartTime + launcherArgs.timeout) {
            this.onError("TimeoutException");
            return;
        }
        const timeBetweenTries = 250;
        setTimeout(() => {
            try {
                const localAppUrl = `ws://localhost:${launcherArgs.port}/`;
                const _this = this;
                Logger.log("connecting to: " + localAppUrl);
                let connection = new WebSocket(localAppUrl);
                connection.onopen = function (event) {
                    Logger.log({'onopen': event});
                };
                connection.onmessage = function (event) {
                    Logger.log({'onmessage': event});
                    let isFirstMessage = _this.connection === undefined;
                    if (isFirstMessage) {
                        if (event.data === 'DesktopHello') {
                            // set the connection and finalize handshake
                            _this.connection = connection;
                            _this.connection.send("WebHello");
                            _this.onConnect();
                        } else {
                            _this.onError("IllegalDesktopHelloMessageException");
                        }
                    } else {
                        _this.onMessage(event.data);
                    }
                };
                connection.onerror = function (event) {
                    Logger.log({'onerror': event});
                    _this.connect(args, connectStartTime);
                };
            } catch (e) {
                // in case of exception when constructing Websocket object
                // try Proxy-Window i.e. Firefox SecurityException https-http
                this.onError(e);
            }
        }, timeBetweenTries);
    }

    send(message) {
        if (this.connection === undefined) {
            throw new Error("IllegalConnectionException");
        } else {
            this.connection.send(message);
        }
    }

    // // do not use directly
    // // every application must have its own script & launcher
    // static launch(args, onMessage, onError) {
    //     try {
    //         let {_, applicationArgs} = args;
    //         let nativeApplication = new NativeApplication(function () {
    //             nativeApplication.send(JSON.stringify(applicationArgs));
    //         }, function (response) {
    //             onMessage(response);
    //         }, function (error) {
    //             onError(error);
    //         });
    //         nativeApplication.connect(args, (new Date).getTime());
    //     } catch (e) {
    //         onError(e);
    //     }
    // }
}

module.exports = NativeApplication;