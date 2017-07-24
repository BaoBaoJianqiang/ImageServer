var fs = require('fs')
var http = require('http');
var https = require('https');
var gm = require('gm');
var myGlobal = require("./global");
var fnv = require('fnv-plus');

function corpImage(width, height, quality, url, callback) { 
        //hash，生成文件名
        var newUrl = url + '?width=' + width + '&height=' + height + '&quality=' + quality;
        var newFileName = fnv.hash(newUrl, 32).str() + '.jpg';
        var imagePath = './image/';

        console.log('2');
        console.log(myGlobal[url]);

        gm(imagePath + myGlobal[url])
           .resize(width, height, '!')
           .quality(quality) 
           .write(imagePath + newFileName, function (err) {
               if (!err) {
                  //裁剪后图片的缓存
                  myGlobal[newUrl] = newFileName;

                  callback(imagePath + newFileName);
                                 　
               } else 
                  console.log('1');
                  console.log(err);
            });
}

function getImage(width, height, quality, url, callback) { 
   function downloadImageCallback(res) {
　　　　  var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
　　　　  var size = 0;　　 //保存缓冲数据的总长度

　　　　  res.on('data',function(chunk){
　　　　　　　　　　　chunks.push(chunk);　 　　　　　　　　
　　　　            size += chunk.length;　　//累加缓冲数据的长度
　　　　　　　});

  　　　 res.on('end',function(err){

　　　　　　　　  var data = Buffer.concat(chunks, size);　　//Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
               console.log(Buffer.isBuffer(data));　　　　//可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
         　　　　var base64Img = data.toString('base64');　　//将Buffer对象转换为字符串并以base64编码格式显示


　　　　         var decodeImg = new Buffer(base64Img, 'base64');  // new Buffer(string, encoding)
        
                // 生成图片(把base64位图片编码写入到图片文件)
                var reg = /.*\/(.*)/;
                var imageName = url.replace(reg,"$1");    
                console.log('3');            
                console.log(url);
                console.log(imageName);

                //hash，生成文件名
                var oriFileName = fnv.hash(url, 32).str() + '.jpg';                
                var imagePath = './image/';

                fs.writeFile(imagePath + oriFileName, decodeImg, function(err) {
                    if(!err) {
                      //原始图片的缓存
                      myGlobal[url] = oriFileName;

                      // 使用gm存在本地
                      corpImage(width, height, quality, url, callback);
                    } 
                });　
　　　　　　});
   }

   console.log('4');
   console.log(url.toString().substring(0,5));

   //区分http和https
   if(url.toString().substring(0,5).toLowerCase() == 'https') {
     https.get(url, downloadImageCallback);
   } else {
     http.get(url, downloadImageCallback);
   }
}

exports.getImage = getImage;
exports.corpImage = corpImage;
