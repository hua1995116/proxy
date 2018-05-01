const {parse} = require('url');
const http = require('http');

function proxy(req, res, options) {
  let url = options.target || '';
  const requestOptions = parse(url);
  Object.assign(requestOptions, {
    method: req.method
  });
  
  const proxyReq = http.request(requestOptions);  

  proxyReq.on('error', function(e) {
      console.log('problem with request: ' + e.message);
  });
   
  proxyReq.on('response', function(proxyRes) {
      proxyRes.on('end', function () {
          console.log('=======end=======');
      });
      proxyRes.pipe(res);
  })
  
  proxyReq.end();
}

module.exports = proxy;
