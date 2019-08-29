//
// npm install -g httpserver
// npm install -g browserify
// npm install socket.io
//
// node_modules\.bin\babel src --out-dir lib
// browserify lib/refirma.js -o public/refirma.js
// http-server
//
module.exports = function (api) {
    api.cache(true);

    // https://babeljs.io/docs/en/babel-preset-env
    const presets = [
        [
            "@babel/env",
            {
                targets: {
                    firefox: "55",
                    chrome: "59",
                    ie: "10"
                },
                // add polyfills with core-js@2
                // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
                // npm install --save core-js@2
                // yarn add core-js@2
                useBuiltIns: "usage",
                corejs: 2
            },
        ],
    ];
    const plugins = [
        // "@babel/plugin-proposal-class-properties"
    ];

    return {
        presets,
        plugins
    };
};
