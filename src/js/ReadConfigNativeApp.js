"use strict";

/**
 * @author lmiguelmh
 **/
const vars = require('./vars');
const messages = require('./messages');
const URIUtils = require('./URIUtils');
const NativeApplication = require('./NativeApplication');

const PORT = 42001;
const TIMEOUT = 5000;
const CHILD = "read.config.exe";

class ReadConfigNativeApp {
    static readJSON(config) {
        return new Promise((resolve, reject) => {
            try {
                // launch uri protocol
                const launcherArgs = {port: PORT, timeout: TIMEOUT, child: CHILD};
                // try connections to local ws until timeout
                let buffer = "";
                let errorEvent = false;
                let nativeApplication = new NativeApplication(
                    function () {
                        nativeApplication.send(config);

                    }, function (message) {
                        buffer += message + "\n";

                    }, function () {
                        if (!errorEvent) {
                            try {
                                resolve(JSON.parse(buffer));
                            } catch (e) {
                                reject(e);
                            }
                        }

                    }, function (error) {
                        errorEvent = true;
                        reject(error);

                    }, function () {
                        const uri = URIUtils.buildUri(vars.URI_PROTOCOL, "fp", launcherArgs);
                        URIUtils.launch(uri);

                    }, 250);
                nativeApplication.connect(launcherArgs, (new Date).getTime(), false);
            } catch (e) {
                reject(e);
            }
        });
    }
}

global.ReadConfigNativeApp = ReadConfigNativeApp;
module.exports = ReadConfigNativeApp;
