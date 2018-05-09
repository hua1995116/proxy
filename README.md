# proxy
http-proxy 源码解析以及实现

proxy-01   简版proxy

proxy-02   封装proxy

proxy-03   中间件proxy，支持express

这段时间进行了前后端的分离,调试中遇到一个问题,跨域。


现阶段接口跨域调试的3中方式。

1.jsonp

2.cros

3.代理

代理（英语：Proxy）也称网络代理，是一种特殊的网络服务，允许一个网络终端（一般为客户端）通过这个服务与另一个网络终端（一般为服务器）进行非直接的连接。一些网关、路由器等网络设备具备网络代理功能。一般认为代理服务有利于保障网络终端的隐私或安全，防止攻击。

正向代理，意思是一个位于客户端和原始服务器(origin server)之间的服务器，为了从原始服务器取得内容，客户端向代理发送一个请求并指定目标(原始服务器)，然后代理向原始服务器转交请求并将获得的内容返回给客户端。

反向代理（Reverse Proxy）方式是指以代理服务器来接受internet上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个反向代理服务器。

# 代理

1.正向代理
正向代理即是客户端代理, 代理客户端, 服务端不知道实际发起请求的客户端.

2.反向代理

反向代理即是服务端代理, 代理服务端, 客户端不知道实际提供服务的服务端.

# 图解 



正向代理

![](https://img-blog.csdn.net/20180501143538251)

![](http://hyf-pic-1251965041.cossh.myqcloud.com/R%5D8CJEDHR_S%5D9_Y%607LDVTXG.png)


反向代理

![](https://img-blog.csdn.net/20180501143553266)

![](http://hyf-pic-1251965041.cossh.myqcloud.com/~%29PTQ%60%60R4CQ_XW%60258TGB%7BK.png)
# 项目中的代理

http-proxy-middleware

支持connect, express and browser-sync

```
var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();

app.use('/api', proxy({target: 'http://www.example.org', changeOrigin: true}));
app.listen(3000);

```

查看他的部分源码

```
var _ = require('lodash')
**var httpProxy = require('http-proxy')**
var configFactory = require('./config-factory')
var handlers = require('./handlers')
var contextMatcher = require('./context-matcher')
var PathRewriter = require('./path-rewriter')
var Router = require('./router')
var logger = require('./logger').getInstance()
var getArrow = require('./logger').getArrow

module.exports = HttpProxyMiddleware

```
核心库

http-proxy

# http-proxy详解
使用
```
var http = require('http'),
    httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
var server = http.createServer(function(req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  proxy.web(req, res, { target: 'http://127.0.0.1:5060' });
});

console.log("listening on port 5050")
server.listen(5050);
```


目录结构

![](https://img-blog.csdn.net/201805011759320)

http-proxy.js
```
var ProxyServer = require('./http-proxy/index.js').Server;

function createProxyServer(options) {

  return new ProxyServer(options);
}


ProxyServer.createProxyServer = createProxyServer;
ProxyServer.createServer      = createProxyServer;
ProxyServer.createProxy       = createProxyServer;

module.exports = ProxyServer;
```

./http-proxy/index.js

```
httpProxy.Server = ProxyServer;

function createRightProxy(type) {

  return function(options) {
    return function(req, res /*, [head], [opts] */) {
      var passes = (type === 'ws') ? this.wsPasses : this.webPasses,
          args = [].slice.call(arguments),
          cntr = args.length - 1,
          head, cbl;

      ...一堆if
      for(var i=0; i < passes.length; i++) {
        进行循环处理passes
        if(passes[i](req, res, requestOptions, head, this, cbl)) { // passes can return a truthy value to halt the loop
          break;
        }
      }
    };
  };
}
httpProxy.createRightProxy = createRightProxy;

function ProxyServer(options) {
  EE3.call(this);

  options = options || {};
  options.prependPath = options.prependPath === false ? false : true;

  this.web = this.proxyRequest           = createRightProxy('web')(options);
  this.ws  = this.proxyWebsocketRequest  = createRightProxy('ws')(options);
  this.options = options;

  this.webPasses = Object.keys(web).map(function(pass) {
    return web[pass];
  });

  this.wsPasses = Object.keys(ws).map(function(pass) {
    return ws[pass];
  });

  this.on('error', this.onError, this);

}

require('util').inherits(ProxyServer, EE3);

```


结构



ProxyServer.createServer创建使用

ProxyServer.createServer 等价createProxyServer

createProxyServer 返回一个ProxyServer实例

ProxyServer 

ProxyServer 拥有web属性

web属性createRightProxy   支持http，https，webscoket

轮询方法 deleteLength， 设置content-length
        timeout
        XHeaders
        stream  核心方法  
          处理 http.request  核心模块
          pipe  response

看图

![](http://hyf-pic-1251965041.cossh.myqcloud.com/ProxyServer.png)


自己实现

![](http://hyf-pic-1251965041.cossh.myqcloud.com/liuchengtu.png)

api.js

```
const http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    response.write(JSON.stringify({huayifeng: 1}));
    response.end();
}).listen(8081, '127.0.0.1');
```

index.js
```
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
```