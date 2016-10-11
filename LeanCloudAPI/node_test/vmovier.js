var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs"),
  http = require('http'),
  request = require("request"),
  async = require('async');
var atime = +new Date;
var crawlUrl = "www.vmovier.com",locPage = "/{{num}}?from=index_new_title",//1-20000
    bingfa = 10,
    oldstart=0;
    // locJson =  require("./"+crawlUrl+'/10001~20000.json'),
    // oldstart=+locJson[locJson.length-1]+1;
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
  var dqxc=0;
  var pub_liunNow=1,pub_allList=[],pub_oldList=0,timeOut;
  var getPicLun = function(Length,lunNum,mxc){
      //denglu()
      mkdirPath(crawlUrl);
      pub_liunNow=1,pub_allList=[],pub_oldList=0;
      getPic(oldstart,oldstart+Length,{
        Length:Length,
        lunNum:lunNum
      },mxc);
  }

  var getPic = function(start,end,lunObj,mxc){
    var btime = +new Date,
        urls_1=[];
    for(var i = start; i < end; i++) {
      urls_1.push({
        url:'http://' + crawlUrl + locPage.replace('{{num}}', i),
        id:i
      });
    }
    var repNum={};
    var getInfo=function(url_1, callback) {
      superagent.get(url_1.url).redirects(0) .end(function(err, sres) {
          if(sres){
          var $ = cheerio.load(sres.text)
           var canonical=$('[rel="canonical"]').attr("href");
          if(canonical==url_1.url){
            pub_allList.push(url_1.id);            
            save("all.json",pub_allList.sort(function(a,b){return a-b}));
          }
        }
        callback(null)
      });
    }
    async.mapLimit(urls_1, bingfa, getInfo, function(err, result) {
      if(dqxc!=mxc){return;}
      console.log(start+'~' + (end-1) + '页，共' + (pub_allList.length-pub_oldList) + '有用链接，用时'+((new Date)-btime)/1000+'秒。');
      pub_oldList=pub_allList.length;
      clearTimeout(timeOut);
      if(lunObj&&lunObj.lunNum>=(++pub_liunNow)){

          // timeOut=setTimeout(function(){
          //   dqxc++;
          //   console.log('用时超过5倍，请重试')
          //   oldstart=end;
          //   setTimeout(function(){
          //     getPicLun(100,100,dqxc)
          //   },10000);
          // },((new Date)-btime)*5+10000)
          setTimeout(function(){
            getPic(start+lunObj.Length,end+lunObj.Length,lunObj);
          },10000);
      }else{
        save(oldstart+"~"+(end-1)+".json",JSON.stringify(pub_allList.sort(function(a,b){return a-b})));

        console.log('一共' + pub_allList.length + '有用链接，'+((new Date)-atime)/1000+'秒。');
      }
    });
  }
  var timexc =function(){
    setTimeout(function(){
      console.log("已过"+(new Date-atime)/1000+"秒");
      timexc();
    },10000)
  }
  var getOneByOne=function() {
    var btime = +new Date,
        urls_1=[];
    for(var i = oldstart; i < 20000; i++) {
      urls_1.push({
        url:'http://' + crawlUrl + locPage.replace('{{num}}', i),
        id:i
      });
    }
    var getOne=function(num) {
      var ctime = +new Date;
      clearTimeout(timeOut);
      timeOut=setTimeout(function(){
        console.log("重试");
        getOne(num); 
      },10000)
      superagent.get(urls_1[num].url).end(function(err, sres) {
        console.log(urls_1[num].url)
        if(new Date-ctime>10000){return;}
        if(sres){
          var $ = cheerio.load(sres.text)

           var canonical=$('[rel="canonical"]').attr("href");
          if(canonical==urls_1[num].url){
            console.log("get:"+urls_1[num].id)
            save("10001~20000.json",JSON.stringify(locJson.concat([urls_1[num].id])));
          }
        }
        num++;
        setTimeout(function(){
          getOne(num); 
        },100);
      });
    }
    getOne(0);
  }
  return{
    getPic:getPic,
    getPicLun:getPicLun,
    timexc:timexc,
    getOneByOne:getOneByOne
  }
}
// process.on('SIGINT', (code) => {
//   console.log(`About to exit with code: ${code}`);
//   process.exit(errorList)
// });
var x=main();
x.getPicLun(20000,1,0);
//x.getOneByOne()
x.timexc();

