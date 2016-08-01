var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs"),
  http = require('http'),
  async = require('async');

var bingfa = 5,
  page = 1,
  crawlUrl = "www.lovefou.com",
  locPage = "/dongtaitu/list_{{num}}.html";
var btime = +new Date;


var urls_1 = [],
  count = 1,
  allcount = 0,
  allpic = 0;

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
function saveImg(url){
    var fileName = url.replace(/[/\\:*?<>\"|]/g, "");
    http.get(url, function(res){
        res.setEncoding('binary');
        var data='';
        res.on('data', function(chunk){
            data+=chunk;
        });
        res.on('end', function(){
            fs.writeFile(crawlUrl + "/"+fileName, data, 'binary', function (err) {
                //if (err) throw err;
            });
            
        console.log('用时'+((new Date)-btime)/1000+'秒。');
        });
        console.log('用时'+((new Date)-btime)/1000+'秒。');
    })
    // .on('error', function(e) {
    //     console.log('error'+e)
    // });
}
var allFileList = [];
var fetchUrl = function(url_1, callback) {
  superagent.get(url_1).end(function(err, sres) {
    var hrefList = cheerio.load(sres.text)("#long>a");
    allcount += hrefList.length;
    var urls_2=[]
    for(var i = 0; i < hrefList.length; i++) {
      urls_2.push(url.resolve("http://" + crawlUrl, hrefList.eq(i).attr("href")));

    }
    callback(null, urls_2);
  });
};
var fetchUrl2 = function(url_2, callback) {
  superagent.get(url_2).end(function(err, sres) {
    var hrefList = cheerio.load(sres.text)(".dongtai img");
    allpic += hrefList.length;
    var urls_2=[]
    for(var i = 0; i < hrefList.length; i++) {
      saveImg(hrefList.eq(i).attr("src"));
    }
    callback(null, urls_2);
  });
};
async.mapLimit(urls_1, bingfa, function(url_1, callback) {
  fetchUrl(url_1, callback);
}, function(err, result) {
  console.log('全部' + page + '页，并发数' + bingfa + '个，共' + allcount + '个url');
  var urls_2=(result+"").split(",");
  urls_2.length=1;
  async.mapLimit(urls_2, bingfa, function(url_2, callback) {
    fetchUrl2(url_2, callback);
  }, function(err, result) {

    console.log('共' + allpic + '张gif，用时'+((new Date)-btime)/1000+'秒。');
  });
});