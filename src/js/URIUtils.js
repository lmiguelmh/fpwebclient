"use strict";

/**
 * @author lmiguelmh
 **/

class URIUtils {
    static buildUri(protocol, baseUri, args) {
        var params = btoa(JSON.stringify(args));
        return `${protocol}://${baseUri}/?${params}`;
    }

    static launch(uri) {
        var frame = document.createElement('iframe');
        frame.width = 1;
        frame.height = 1;
        frame.style.border = 'none';
        frame.style.position = 'absolute';
        frame.src = uri;
        document.body.appendChild(frame);
        var deleteFrameTime = 1000;
        setTimeout(function () {
            document.body.removeChild(frame);
        }, deleteFrameTime);
    }
}

module.exports = URIUtils;
