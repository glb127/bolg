var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs"),
  http = require('http'),
  request = require("request"),
  async = require('async');

var atime = +new Date;
var crawlUrl = "www.an77la.com",locPage = "/article-list-id-20-page-{{num}}.html",//1-426
    bingfa = 25,
    oldstart=1;
var pageJson = null; 

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

  //var pub_liunNow=1,pub_allList=[],pub_oldList=0;
  var getPicLun = function(Length,lunNum){
      mkdirPath(crawlUrl);
      var pub_liunNow=1,
          pub_allList=[],
          pub_oldList=0,
          pub_repeat={};

      var getPic = function(start,end,lunObj){
        var btime = +new Date,
            urls_1=[];
        for(var i = start; i < end; i++) {
          urls_1.push('http://' + crawlUrl + locPage.replace('{{num}}', i));
        }
        async.mapLimit(urls_1, bingfa, function(url_1, callback) {
          superagent.get(url_1).end(function(err, sres) {
            if(sres){
              var href=cheerio.load(sres.text)("[href]");
              for(var i=0;i<href.length;i++){
                var id=href.eq(i).attr("href").substring(17,href.eq(i).attr("href").indexOf("."));
                if(id>100&&!pub_repeat[id]){
                  pub_allList.push({
                    id:id,
                    name:href.eq(i).text()
                  });
                  pub_repeat[id]=true;
                }
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
            save(1+"~"+(end-1)+".json",JSON.stringify(pub_allList));
            //console.log(pub_allList)
            console.log('一共' + pub_allList.length + '有用链接，'+((new Date)-atime)/1000+'秒。');
          }
        });
      }

      getPic(oldstart,oldstart+Length,{
        Length:Length,
        lunNum:lunNum
      });
  }

  
  var getIdNum = function(){
    var urls_1=[];
    for(var i = 0; i < 100; i++) {
      urls_1.push('http://'+crawlUrl+'/article-list-id-{{list}}-page-1.html'.replace('{{list}}', i));
    }
    var getIdNumType = function (num) {
      superagent.get(urls_1[num]).end(function(err, sres) {
        if(sres){
          var $ = cheerio.load(sres.text)
          var href=$(".end").text();
          if(href>0){
            pub_allList.push({
              id:num,
              page:href,
              name:$(".place a").text()
            });
          }
        }
        if(num<urls_1.length-1){
          console.log(num++);
          getIdNumType(num);
        }else{
          save("index.json",JSON.stringify(pub_allList));
          console.log(pub_allList.length);
          console.log("获取列表"+((new Date)-atime)/1000+'秒。');
        }
      });
    }

    getIdNumType(0);
  }

  var getPageInfo=function(page){
    var json=require('./'+crawlUrl+"/"+page+".json");
    var count=0;
    var error=[];
    for(var i=0;i<json.length;i++){
      var _tmp=json[i].text.substring(json[i].text.indexOf("【")+1,json[i].text.indexOf("】"));
      if(_tmp!=""&&_tmp[0]!="【"){
        count++;
      }else{
        error.push(json[i].text);
      }
    }
    console.log(json.length,count);
    console.log(error)
    console.log("获取"+page+"内容"+((new Date)-atime)/1000+'秒。');
  }

  return{
    getIdNum:getIdNum,
    getPicLun:getPicLun,
    getPageInfo:getPageInfo
  }
}

var x=main();
//x.getIdNum();
x.getPicLun(100,5);
//x.getPageInfo(20);
