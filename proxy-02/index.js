const http = require('http');
const proxy = require('./proxy');

http.createServer(function (req, res) {
    proxy(req, res, { target: 'http://127.0.0.1:8081' });
}).listen(8080, '127.0.0.1');
