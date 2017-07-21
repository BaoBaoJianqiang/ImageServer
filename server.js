var http = require('http');
var fs = require("fs"); 
var gm = require("./gm");
var myGlobal = require("./global");

http.createServer(function (request, response) {
      request.setEncoding('utf-8');

      // 发送 HTTP 头部 
      // HTTP 状态值: 200 : OK
      // 内容类型: image/jpeg
      //image/gif
      //image/png
      response.writeHead(200, {'Content-Type': 'image/jpeg'});      

      console.log(request.url);
      var params = require("url").parse(request.url).query;
      if(params) {
        params = params.toLowerCase();
      }

      var obj = require("querystring").parse(params);
      if(obj.width == undefined) {
        obj.width = 100;
      }
      if(obj.height == undefined) {
        obj.height = 100;
      }

      if(obj.quality == undefined) {
        obj.quality = 100;
      }

      console.log(obj.width);
      console.log(obj.height);
      console.log(obj.quality);
      console.log(obj.url);

      var content = "";

      gm.getImage(response, obj.width, obj.height, obj.quality, obj.url, function(path) {
            console.log('1234');
            console.log(path);

            console.log(myGlobal[obj.url]);

            content = fs.readFileSync(path, "binary");   //格式必须为 binary 否则会出错

            response.write(content,"binary"); //格式必须为 binary，否则会出错
            response.end('');
      });

      // var path = dict[obj.url];
      // if(!path) {
      //   content = fs.readFileSync(path, "binary")   
      // } else {
      //   content = gm.getImage(obj.width, obj.height, obj.quality, obj.url);
      //   dict[obj.url] = 
      // }   

}).listen(9999);

console.log('Server running at http://127.0.0.1:9999/');
