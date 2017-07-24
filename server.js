var http = require('http');
var fs = require("fs"); 
var helper = require("./helper");
var gm = require('gm');
var myGlobal = require("./global");

var server = http.createServer(function (request, response) {
     var pathname = require("url").parse(request.url).pathname; 
        if(pathname == '/favicon.ico'){ 
        return; 
     }

      function callback(path) {  
            var content = fs.readFileSync(path, "binary");   //格式必须为 binary 否则会出错
            response.write(content,"binary"); //格式必须为 binary，否则会出错
            response.end('');
      }

      request.setEncoding('utf-8');

      // 发送 HTTP 头部 
      // HTTP 状态值: 200 : OK
      // 内容类型: image/jpeg
      //image/gif
      //image/png
      response.writeHead(200, {'Content-Type': 'image/jpeg'});      

      console.log('request.url: ' + request.url);
      var params = require("url").parse(request.url).query;      

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

      var imagePath = './image/';

      console.log('obj.url: ' + obj.url);
      var decodeURL = new Buffer(obj.url, 'base64').toString();
      console.log('decodeURL: ' + decodeURL);

      var newUrl = decodeURL + '?width=' + obj.width + '&height=' + obj.height + '&quality=' + obj.quality;
      console.log('7');
      console.log(newUrl);
      //缓存
      if(myGlobal[newUrl] != undefined) {
        console.log('裁剪后的图片有，直接使用');

        callback(imagePath + myGlobal[newUrl]);

      } else if(myGlobal[obj.url] != undefined ) { 
        console.log('裁剪后的图片没有，原始图片有，则裁剪后再使用');        

        helper.corpImage(obj.width, obj.height, obj.quality, decodeURL, callback);
      } else { 
        console.log('裁剪后的图片没有，原始图片也没有，则下载+裁剪+使用');
        helper.getImage(obj.width, obj.height, obj.quality, decodeURL, callback);
      }

});

server.listen(9999);

console.log('Server running at http://127.0.0.1:9999/');
