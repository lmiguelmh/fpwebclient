"use strict";

/**
 * @author lmiguelmh
 **/
const vars = require('./vars');
const messages = require('./messages');
const URIUtils = require('./URIUtils');
const NativeApplication = require('./NativeApplication');

const PORT = 42000;
const TIMEOUT = 5000;
const CHILD = "devices.api.exe";  // desklayer_server.exe ??

class DevicesApiNativeApp {

    static captureFingerprint(captureArgs) {
        return new Promise((resolve, reject) => {
            try {
                const launcherArgs = {port: PORT, timeout: TIMEOUT, child: CHILD};
                let nativeApplication = new NativeApplication(
                    function () {
                        nativeApplication.send(JSON.stringify(captureArgs));

                    }, function (responseJson) {
                        try {
                            // exitCode, wsq, jpg
                            console.log(responseJson);
                            let response = JSON.parse(responseJson);
                            if (response.exitcode === "0") {
                                resolve(response);
                            } else {
                                reject(response.error + " " + response.solution);
                            }
                        } catch (e) {
                            reject(e);
                        }

                    }, function () {
                        // ignored

                    }, function (error) {
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

    // // the app shouldn't change the ports, this is only for dummy
    // static execute(applicationArgs, child = "core42-device", port = 42000, timeout = 5000) {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             // launch uri protocol
    //             //const launcherArgs = {port: 42000, timeout: 5000, child: "desklayer_server"};
    //             const launcherArgs = {port: port, timeout: timeout, child: child};
    //             // try connections to local ws until timeout
    //             let nativeApplication = new NativeApplication(
    //                 function () {
    //                     nativeApplication.send(JSON.stringify(applicationArgs));
    //                 }, function (message) {
    //                     resolve(message);
    //                 }, function () {
    //                     // ignored
    //                 }, function (error) {
    //                     reject(error);
    //                 }, function () {
    //                     const uri = URIUtils.buildUri(vars.URI_PROTOCOL, "fp", launcherArgs);
    //                     URIUtils.launch(uri);
    //                 }, 250);
    //             nativeApplication.connect(launcherArgs, (new Date).getTime(), false);
    //         } catch (e) {
    //             reject(e);
    //         }
    //     });
    // }
}

global.DevicesApiNativeApp = DevicesApiNativeApp;
module.exports = DevicesApiNativeApp;
