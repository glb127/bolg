var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs"),
  http = require('http'),
  request = require("request"),
  async = require('async');


var atime = +new Date;
var pageID=20;

var crawlUrl = "www.an77la.com",locPage = "/article-show-id-{{num}}.html",//1-10000000
    json20 = require('./'+crawlUrl+'/'+pageID+'.json'),
    bingfa = 5,
    oldstart=0;

function main(){
  var mkdirPath=function(loc) {
    fs.exists(loc, function(exists) {    
      if(!exists) {      
        fs.mkdir(loc, function(err) {        
          if(err) {          
            console.log('创建文件夹出错！');        
          } else {          
            console.log('文件夹' + loc + '-创建成功！');        
          }      
        });    
      }  
    });
  }
  var save=function(fileName, info, callback) {
    fileName = fileName.replace(/[/\\:*?<>\"|]/g, "");
    fs.writeFile(crawlUrl +"/"+pageID +"/" + fileName, info, function(err) {
  	if(err) console.log(err);
		if(callback){
      		callback(null);
      	}
    });
  }
  function saveImg(url,dir,callback){
    var filename = url.replace(/[/\\:*?<>\"|]/g, "");
    var writeStream =fs.createWriteStream(dir+ "/" + filename)
    request(url).pipe(writeStream);    
    writeStream.on('finish', function(){
		if(callback){
      		callback(null);
      	}
    });
  }

  var getPicLun = function(Length,lunNum){
      mkdirPath(crawlUrl);
      mkdirPath(crawlUrl+"/"+pageID);
      var pub_liunNow=1;

      var getPic = function(start,end,lunObj){
        var btime = +new Date,
            urls_1=json20.slice(start,end);
        async.mapLimit(urls_1, bingfa, function(url_1, callback) {
          superagent.get('http://' + crawlUrl + locPage.replace('{{num}}', url_1.id)).end(function(err, sres) {
            if(sres){
              var $ = cheerio.load(sres.text)
              var content=$(".content").text().slice(0,-190);
              if(content){
                save(url_1.id+".txt",url_1.name+" "+content,callback);
                return;
              }
            }
            callback(null);            
          });
        }, function(err, result) {
          
          console.log(start+'~' + end + '项，用时'+((new Date)-btime)/1000+'秒。');
          if(lunObj&&lunObj.lunNum>=(++pub_liunNow)){
              getPic(start+lunObj.Length,end+lunObj.Length,lunObj);
          }else{
            console.log('一共' + lunObj.Length*lunObj.lunNum + '有用链接，'+((new Date)-atime)/1000+'秒。');
          }
        });
      }

      getPic(oldstart,oldstart+Length,{
        Length:Length,
        lunNum:lunNum
      });
  }
  return{
    getPicLun:getPicLun
  }
}

var x=main();
x.getPicLun(20,2);

