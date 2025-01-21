var http = require("http");
var https = require("https");

exports.getJson = function(options, onResult){
    let port = options.port == 443 ? https : http;
    let req = port.request(options, function(res) {
        let output ='';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf-8');

        res.on('data', function(chunk) {
            output += chunk;
        });

        res.on('end', function() {
            let obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        console.log('error: '+ err.message)
    });

    req.end();
};
/*
var options = {
    host: 'somesite.com',
    port: 443,
    path: '/some/path',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};
*/