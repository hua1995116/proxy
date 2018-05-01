var http = require('http');

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
    console.log(req.url);
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.write(JSON.stringify({huayifeng: 1}));
    res.end();
});

console.log("listening on port 5060")
server.listen(5060);