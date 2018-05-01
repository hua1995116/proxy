const http = require('http');

http.createServer(function (req, res) {
    proxy(req, res);
}).listen(8080, '127.0.0.1');

function proxy(req, res) {
    const options = {
        hostname: '127.0.0.1',
        port: 8081,
        path: '/',
        method: 'GET',
    };
    
    const proxyReq = http.request(options);  

    proxyReq.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
     
    proxyReq.on('response', function(proxyRes) {
        proxyRes.on('end', function () {
            console.log('end');
        });
        proxyRes.pipe(res);
    })
    
    proxyReq.end();
}