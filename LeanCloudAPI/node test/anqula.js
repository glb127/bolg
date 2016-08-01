var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs"),
  http = require('http'),
  request = require("request"),
  async = require('async');
var atime = +new Date;
var crawlUrl = "www.an77la.com",locPage = "/article-show-id-{{num}}.html",//1-10000000
    bingfa = 25,
    oldstart=1;
//"http://www.an77la.com/article-list-id-20-page-2.html"
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

  var pub_liunNow=1,pub_allList=[],pub_oldList=0;
  var getPicLun = function(Length,lunNum){
      mkdirPath(crawlUrl);
      pub_liunNow=1,pub_allList=[],pub_oldList=0;
      getPic(oldstart,oldstart+Length,{
        Length:Length,
        lunNum:lunNum
      });
  }

  var getPic = function(start,end,lunObj){
    var btime = +new Date,
        urls_1=[];
    for(var i = start; i < end; i++) {
      urls_1.push('http://' + crawlUrl + locPage.replace('{{num}}', i));
    }
    async.mapLimit(urls_1, bingfa, function(url_1, callback) {
      superagent.get(url_1).end(function(err, sres) {
        if(sres){
          var $ = cheerio.load(sres.text)
			    var title=$(".title h2").text();
          console.log($("body").html())
          if(title){
            pub_allList.push("");
            save(title+".html",$(".content").html(),callback);
            return;
          }
        }
          callback(null)
        
      });
    }, function(err, result) {
      
      console.log(start+'~' + (end-1) + '页，共' + (pub_allList.length-pub_oldList) + '有用链接，用时'+((new Date)-btime)/1000+'秒。');
      pub_oldList=pub_allList.length;
      if(lunObj&&lunObj.lunNum>=(++pub_liunNow)){
          getPic(start+lunObj.Length,end+lunObj.Length,lunObj);
      }else{
        //save(1+"~"+(end-1)+".json",JSON.stringify(pub_allList));

        console.log('一共' + pub_allList.length + '有用链接，'+((new Date)-atime)/1000+'秒。');
      }
    });
  }
  return{
    getPic:getPic,
    getPicLun:getPicLun
  }
}

var x=main();
x.getPicLun(1,2);

