var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs") ,
  async = require('async');


var count=0,
    allcount=0;
    bingfa=2,
    page=3;

function save(fileName,info){
  fileName=fileName.replace(/[/\\:*?<>\"|]/g,"");
  fs.writeFile("w3cfun/"+fileName,info,function (err) {
       if (err) throw err ;
  }) ;
}
var urls_2 = [];
var fetchUrl = function (url_1, callback) {
  superagent.get(url_1).end(function(err, sres) {    
    var $ = cheerio.load(sres.text);
    allcount+=$(".media-heading :nth-child(3n)").length;
    for(var i =0;i<$(".media-heading :nth-child(3n)").length;i++){
      var url_2=url.resolve("http://www.w3cfuns.com", $(".media-heading :nth-child(3n)").eq(i).attr("href"));
        
      superagent.get(url_2).end(function(err2, sres2) { 
        var $1 = cheerio.load(sres2.text);
        save($1("header h1").text()+".txt",$1(".editor_content").html())
        count++;
        if(allcount==count){
          console.log('全部保存完成');
        }
      });
    }
    callback(null,count);
  });
};

var urls_1 = [];
for(var i = 1; i <= page; i++) {
  urls_1.push('http://www.w3cfuns.com/notes/page/'+i+'.html');
}

async.mapLimit(urls_1, bingfa, function (url_1, callback) {
  fetchUrl(url_1, callback);
}, function (err, result) {
  console.log('全部'+page+'页打开完成，并发数'+bingfa+'个，共'+allcount+'篇文章等待保存中');
});

