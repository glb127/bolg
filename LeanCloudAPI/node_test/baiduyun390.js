var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs"),
  http = require('http'),
  request = require("request"),
  async = require('async');

require('superagent-proxy')(superagent);

var atime = +new Date;
var crawlUrl = "yun.baidu.com"
var start=4080794744,end=4080794745;
//4080794744
var pageget = "http://yun.baidu.com/pcloud/feed/getsharelist?auth_type=1&start=0&limit=1&query_uk={{uk}}}"

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
    fs.writeFile(crawlUrl + "/" + fileName, info, function(err) {
  	if(err) console.log(err);
		if(callback){
      		callback(null);
      	}
    });
  }

  var getIdNum = function(){
    var pub_allList=[];
    var btime = +new Date,
        urls_1=[];
    for(var i = start; i < end; i++) {
      urls_1.push(pageget.replace('{{uk}}', i));
    }
    async.mapLimit(urls_1, 10, function(url_1, callback) {
      superagent.get(url_1).timeout(2000).proxy('').set({Referer: crawlUrl}).end(function(err, sres) {
        if(sres&&sres.res&&sres.res.body){
          pub_allList.push({
            url:url_1,
            num:sres.res.body.total_count
          });
        }else{
          console.log("error")
        }
        callback(null)        
      });
    }, function(err, result) {
      
      console.log("uk:"+start+'~' + (end-1) + ',共' + pub_allList.length + '有用链接，用时'+((new Date)-btime)/1000+'秒。');
      console.log(pub_allList)
    });
  }

  var getIdOne = function(){
    var pub_allList=[];
    var btime = +new Date,
        urls_1=[];
    for(var i = start; i < end; i++) {
      urls_1.push(pageget.replace('{{uk}}', i));
    }
    var getOne = function(num){
      superagent.get(urls_1[num]).set({Referer: crawlUrl}).end(function(err, sres) {
        if(sres&&sres&&sres.res.body){
          pub_allList.push({
            url:urls_1[num],
            num:sres.res.body.total_count
          });
        }
        num++;
        if(num<urls_1.length){
          setTimeout(function(){
            getOne(num);
          },5000);
        }else{
          console.log("uk:"+start+'~' + (end-1) + ',共' + pub_allList.length + '有用链接，用时'+((new Date)-btime)/1000+'秒。');
      console.log(pub_allList)
        }
      });
    }
    getOne(0)
  }
  return{
    getIdNum:getIdNum,
    getIdOne:getIdOne
  }
}
var x=main();
x.getIdNum()