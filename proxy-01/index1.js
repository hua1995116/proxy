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
    let body = '';
    const proxyReq = http.request(options, function(proxyRes) {
        proxyRes.on('data',function(d){  
            body += d;  
        });  
        proxyRes.on('end', function(){  
            console.log(res.headers);  
            console.log(body)  
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.write(body);
            res.end();
        });  
    });  
    
    proxyReq.end();
}