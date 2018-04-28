const http = require('http');

http.createServer(function (req, res) {
    // console.log(request.url);
    
    proxy(req, res);
}).listen(8080, '127.0.0.1');

var body = '';  
function proxy(req, res) {
    var options = {
        hostname: '127.0.0.1',
        port: 8081,
        path: '/',
        method: 'GET',
    };
    const request = req;
    const response = res;
    // var req = http.request(options)
    
    var req = http.request(options, function(res) {  
  
        console.log("Got response: " + res.statusCode);  
        res.on('data',function(d){  
            body += d;  
        });  
        res.on('end', function(){  
            console.log(res.headers);  
            console.log(body)  
            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            response.write(body);
            response.end();
        });  
    });  

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    // res.on('data',function(d){  
    //     body += d;  
    // });  
    // res.on('end', function(){  
    //     console.log(res.headers);  
    //     console.log(body)  
    // });  
    // req.on('response', function(res) {
    //     console.log(res);
        // response.writeHead(200, {
        //     'Content-Type': 'text/plain'
        // });
        // response.write(res);
        // response.end();
    // })
    
    req.end();
}