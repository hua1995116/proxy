const http = require('http');

http.createServer(function (request, response) {
    console.log(request.url);
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.write("Hello World");
    response.end();
}).listen(8081, '127.0.0.1');