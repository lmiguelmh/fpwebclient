/**
 * @author lmiguelmh
 * @since 20190916
 **/

// var querystring = require('querystring');
// npm i --save https
const https = require('https');
const FPApplication = require('./DevicesApiNativeApp');

class Matcher {
    static match(wsq1, wsq2) {
        return FPApplication.execute({wsq1: wsq1, wsq2: wsq2}, "curl-wrapper", 43000);
        /** doesnt not work! because of CORS
        let query = {
            "op": "match",
            "wsq1": wsq1,
            "wsq2": wsq2
        };
        let dataString = JSON.stringify(query);
        let options = {
            host: "oiydjrran9.execute-api.us-east-1.amazonaws.com",
            path: "/Prod/invocations/",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": dataString.length
            }
        };
        let req = https.request(options, function (res) {
            res.setEncoding('utf-8');

            var responseString = '';

            res.on('data', function (data) {
                responseString += data;
            });

            res.on('end', function () {
                console.log(responseString);
                var responseObject = JSON.parse(responseString);
                success(responseObject);
            });
        });
        req.write(dataString);
        req.end();
         */

        // todo:
        // return new Promise((resolve, reject) => {
        //     const options = {
        //         host: 'www.example.com',
        //         path: '/post/example/action',
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     };
        //
        //     //create the request object with the callback with the result
        //     const req = https.request(options, (res) => {
        //         resolve(JSON.stringify(res.statusCode));
        //     });
        //
        //     // handle the possible errors
        //     req.on('error', (e) => {
        //         reject(e.message);
        //     });
        //
        //     //do the request
        //     req.write(JSON.stringify(data));
        //
        //     //finish the request
        //     req.end();
        // });
    }
}

global.Matcher = Matcher;