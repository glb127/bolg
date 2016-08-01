var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs"),
  async = require('async');

var bingfa = 5,
  page = 10,
  crawlUrl = "www.renren66.com",
  locPage = "/vip_{{num}}.html";
var btime = +new Date;


// superagent.get('http://' + crawlUrl + locPage.replace('{{num}}', 1)).end(function(err, sres) {
//   var pageText = cheerio.load(sres.text)(".pagination-sm").text();
//   page = pageText.substring(pageText.indexOf("/")+1,pageText.indexOf("页"));
//   console.log(page);
// });
// console.log(page);
// return ;
var urls_1 = [],
  count = 1,
  allcount = 0;
for(var i = 1; i <= page; i++) {
  urls_1.push('http://' + crawlUrl + locPage.replace('{{num}}', i));
}
function mkdirPath() {
  fs.exists(crawlUrl, function(exists) {    
    if(!exists) {      
      fs.mkdir(crawlUrl, function(err) {        
        if(err) {          
          console.log('创建文件夹出错！');        
        } else {          
          console.log('文件夹' + crawlUrl + '-创建成功！');        
        }      
      });    
    }  
  });
}
mkdirPath();

function save(fileName, info) {
  fileName = fileName.replace(/[/\\:*?<>\"|]/g, "");
  fs.writeFile(crawlUrl + "/" + fileName, info, function(err) {
    if(err) throw err;
  });
}
var allFileList = [];
var fetchUrl = function(url_1, callback) {
  superagent.get(url_1).end(function(err, sres) {
    var hrefList = cheerio.load(sres.text)(".movie-item>a");
    allcount += hrefList.length;
    for(var i = 0; i < hrefList.length; i++) {
      var url_2 = url.resolve("http://" + crawlUrl, hrefList.eq(i).attr("href"));
      superagent.get(url_2).end(function(err2, sres2) {
        var $ = cheerio.load(sres2.text);
        var _imgs = [];
        for(var i = 1; i < $("img[alt]").length - 1; i++) {
          _imgs.push($("img[alt]").eq(i).attr("src"))
        }
        var _player = [];
        var _baiduyun = {href:"",password:""};
        for(var i=$("#player a").length;i--;){
          var _href=$("#player a").eq(i).attr("href")
          if(_href.match( /http:\/\/pan.baidu.com\/[\w\/\.?=]*/gi)){
            _baiduyun.href=_href;
            _baiduyun.password=$("#player a").eq(i).parent().find("strong").text()
          }else if(_href.indexOf("play")==1){
            _player.unshift(url.resolve("http://" + crawlUrl, _href))
          }
          
        }
        allFileList.push({
          id: $("[data-thread-key]").attr("data-thread-key"),
          name: $(".movie-title").text(),
          img: {
            main: $("img[alt]").eq(0).attr("src"),
            other: _imgs
          },
          player:_player,
          baiduyun:_baiduyun
        })
        if(allcount == count++) {
          save("all.js","var allFile="+JSON.stringify(allFileList));
          console.log(allFileList.length + '部电影信息获取成功，用时'+((new Date)-btime)/1000+"秒。");
        }
      });
    }
    callback(null, count);
  });
};

async.mapLimit(urls_1, bingfa, function(url_1, callback) {
  fetchUrl(url_1, callback);
}, function(err, result) {
  console.log('全部' + page + '页，并发数' + bingfa + '个，共' + allcount + '部电影');
});