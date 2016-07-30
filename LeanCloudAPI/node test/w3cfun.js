var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs") ,
  async = require('async');


var bingfa = 2,
    page = 3,
    crawlUrl = "www.w3cfuns.com",
    locPage="/notes/page/{{num}}.html",
    sonEnt=".media-heading :nth-child(3n)";


var urls_1 = [], count=1, allcount=0;
for(var i = 1; i <= page; i++) {
  urls_1.push('http://'+crawlUrl+locPage.replace('{{num}}',i));
}

function mkdirPath(){
  fs.exists(crawlUrl,function(exists){
    if(!exists){
      fs.mkdir(crawlUrl,function(err){
        if(err){
          console.log('创建文件夹出错！');
        }else{
          console.log('文件夹'+crawlUrl+'-创建成功！');
        }
      });
    }
  });
}
mkdirPath();

function save(fileName,info){
  fileName=fileName.replace(/[/\\:*?<>\"|]/g,"");
  fs.writeFile(crawlUrl+"/"+fileName,info,function (err) {
       if (err) throw err ;
  }) ;
}

var fetchUrl = function (url_1, callback) {
  superagent.get(url_1).end(function(err, sres) {    
    var hrefList = cheerio.load(sres.text)(sonEnt);
    allcount+=hrefList.length;
    for(var i =0;i<hrefList.length;i++){
      var url_2=url.resolve("http://"+crawlUrl, hrefList.eq(i).attr("href"));        
      superagent.get(url_2).end(function(err2, sres2) { 
        var $1 = cheerio.load(sres2.text);
        save($1("header h1").text()+".txt",$1(".editor_content").html())
        if(allcount==count++){
          console.log('全部保存完成');
        }
      });
    }
    callback(null,count);
  });
};


async.mapLimit(urls_1, bingfa, function (url_1, callback) {
  fetchUrl(url_1, callback);
}, function (err, result) {
  console.log('全部'+page+'页打开完成，并发数'+bingfa+'个，共'+allcount+'篇文章等待保存中');
});

