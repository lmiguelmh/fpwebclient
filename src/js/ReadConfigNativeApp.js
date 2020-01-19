"use strict";

/**
 * @author lmiguelmh
 **/
const vars = require('./vars');
const messages = require('./messages');
const URIUtils = require('./URIUtils');
const SimpleNativeApplication = require('./SimpleNativeApplication');

const PORT = 42001;
const CHILD = "read.config.exe";

class ReadConfigNativeApp {
    static readJSON(path) {
        return new Promise((resolve, reject) => {
            try {
                const localAppUrl = `ws://localhost:${PORT}/`;
                let result = "";
                let errorResult = false;
                let nativeApplication = new SimpleNativeApplication(
                    function () {
                        nativeApplication.send(path);

                    }, function (message) {
                        result += message + "\n";

                    }, function () {
                        if (!errorResult) {
                            try {
                                resolve(JSON.parse(result));
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            reject(result);
                        }

                    }, function (error) {
                        errorResult = true;
                        result = error;
                    });
                nativeApplication.connect(localAppUrl);

                // launch URI if no connection!
                setTimeout(() => {
                    if (!nativeApplication.connection) {
                        const taskTrayArgs = {port: PORT, child: CHILD};
                        const uri = URIUtils.buildUri(vars.URI_PROTOCOL, "fp", taskTrayArgs);
                        URIUtils.launch(uri);
                    }
                }, 500);

            } catch (e) {
                reject(e);
            }
        });
    }
}

global.ReadConfigNativeApp = ReadConfigNativeApp;
module.exports = ReadConfigNativeApp;
