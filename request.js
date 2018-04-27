const http = require('http');
const fs = require('fs');

var options = {
    hostname: '127.0.0.1',
    port: 8081,
    path: '/',
    method: 'GET',
};

var req = http.request(options)

req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
});

req.on('response', function(res) {
    // console.log(res.finished);
    // res.on('end', function(s) {
    //     console.log(s);
    // })
    console.log(res);
    // fs.writeFile('1.txt', JSON.stringify(res), err=> {
    //     console.log(err);
    // });
})

req.end();