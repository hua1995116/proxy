var http = require("http");            //提供web服务  
var url = require("url");            //解析GET请求    
var query = require("querystring");    //解析POST请求  
  
//服务  
var server = function(request,response){  
    //定义报文头  
    response.writeHead(200,{"Content-Type":"text/json"});  
    //判断是GET/POST请求  
    if(request.method == "GET"){  
        var params = [];  
        params = url.parse(request.url,true).query;  
        params['result'] = compute(params);  
        response.write(JSON.stringify(params));  
        response.end();  
    }else{  
        var postdata = "";  
        request.addListener("data",function(postchunk){  
            postdata += postchunk;  
        })  
  
        //POST结束输出结果  
        request.addListener("end",function(){  
            var params = query.parse(postdata);  
            params['result'] = compute(params);  
            response.write(JSON.stringify(params));  
            response.end();  
        })  
    }  
  
}  
  
//计算  
var compute = function(params){  
    switch(params['type']){  
        case "add": return parseFloat(params['num']) + parseFloat(params['num1']);break;  
        case "sub": return parseFloat(params['num']) - parseFloat(params['num1']);break;  
        case "mul": return parseFloat(params['num']) * parseFloat(params['num1']);break;  
        case "div": return parseFloat(params['num']) / parseFloat(params['num1']);break;  
    }  
};  
  
http.createServer(server).listen(1234);  
console.log("Server start!");    