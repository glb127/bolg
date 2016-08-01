var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs"),
  async = require('async');

var bingfa = 10,
  maxId = 1600,
  crawlUrl = "www.renren66.com",
  locPage = "/movie/id_{{num}}.html",
  btime = +new Date,
  urls_1 = [],
  allFilmList = [];;

console.log('共' + maxId + '个id，并发数' + bingfa + '个');

for(var i = 1; i < maxId; i++) {
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

var fetchUrl = function(url_1, callback) {
  superagent.get(url_1).end(function(err, sres) {
    var $ = cheerio.load(sres.text);
    if($("[data-thread-key]").length==0){
      callback(null,"");
      return;
    }
    
    var _imgs = [],
      _player = [],
      _magnet = [],
      _baiduyun = {href:"",password:""};
    for(var i = 1; i < $("img[alt]").length ; i++) {
      _imgs.push($("img[alt]").eq(i).attr("src"))
    }

    for(var i=$("#player a").length;i--;){
      var _href=$("#player a").eq(i).attr("href")
      if(_href.match( /http:\/\/pan.baidu.com\/[\w\/\.?=]*/gi)){
        _baiduyun.href=_href;
        _baiduyun.password=$("#player a").eq(i).parent().find("strong").text()
      }else if(_href.indexOf("play")==1){
        _player.unshift(url.resolve("http://" + crawlUrl, _href));
      }else if(_href.indexOf("magnet")==0){
        if(_magnet.indexOf(_href)==-1){
          _magnet.unshift(_href);
        }
      }
      
    }
    var _robj={
      id: $("[data-thread-key]").attr("data-thread-key"),
      name: $(".movie-title").text(),
      img: {
        main: $("img[alt]").eq(0).attr("src"),
        other: _imgs
      },
      player:_player,
      baiduyun:_baiduyun,
      magnet:_magnet,
      uptime:$(".table-striped td").eq(9).text().substr(0,10),
      star:$(".table-striped td").eq(15).html()
    }
    allFilmList.push(_robj)
    callback(null);
  });
};


async.mapLimit(urls_1, bingfa, function(url_1, callback) {
  fetchUrl(url_1, callback);
}, function(err, result) {
  console.log('共' + allFilmList.length + '部电影，用时'+((new Date)-btime)/1000+'秒。');
  save("allfilm.json",JSON.stringify(allFilmList));
});