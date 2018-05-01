const http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.write(JSON.stringify({huayifeng: 1}));
    response.end();
}).listen(8081, '127.0.0.1');