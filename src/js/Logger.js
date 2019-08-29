"use strict";

/**
 * @author lmiguelmh
 **/

const vars = require('./vars');

class Logger {
    static log(arg) {
        if (vars.DEBUG) {
            console.log(arg);
        }
    }
}

module.exports = Logger;
