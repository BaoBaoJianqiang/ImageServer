var http = require('http');
var fs = require("fs"); 

http.createServer(function (request, response) {
      request.setEncoding('utf-8');

      // 发送 HTTP 头部 
      // HTTP 状态值: 200 : OK
      // 内容类型: image/jpeg
      response.writeHead(200, {'Content-Type': 'image/jpeg'});      

      console.log(request.url);
      var params = require("url").parse(request.url).query;
      if(params) {
        params = params.toLowerCase();
      }

      var obj = require("querystring").parse(params);
      console.log(obj.width);
      console.log(obj.height);
      console.log(obj.quality);
      console.log(obj.url);

      var url = 'avatar3.jpg';
      var content = fs.readFileSync(url,"binary");   //格式必须为 binary 否则会出错

      response.write(content,"binary"); //格式必须为 binary，否则会出错
      response.end('');
}).listen(9999);

console.log('Server running at http://127.0.0.1:9999/');
