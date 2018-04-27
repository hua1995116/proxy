const http = require('http');


var options = {
    hostname: '127.0.0.1',
    port: 8081,
    path: '/api/abc',
    method: 'GET',
};

var req = http.request(options )

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});
// console.log(1);
req.on('response', function(res) {
    // console.log(res);
    console.log(res.statusCode);
})

req.end();