var superagent = require('superagent'),
  cheerio = require('cheerio'),
  url = require('url'),
  fs = require("fs"),
  http = require('http'),
  request = require("request"),
  async = require('async');

var atime = +new Date;
var p_crawlUrl = "www.an77la.com",
    p_locPage = "/article-list-id-{{id}}-page-{{num}}.html",//1-426
    p_bingfa = 25,
    p_fengye = 100,
    p_indexName="index.json";
var p_pageJson = require("./"+p_crawlUrl+'/'+p_indexName);
    p_pageJson = p_pageJson.sort(function(a,b){return a.id-b.id;})
    
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
    fs.writeFile(p_crawlUrl + "/" + fileName, info, function(err) {
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

  var getByPageId = function(id,index){
    if(!id){
      id=p_pageJson[0].id;
      index=0;
    }
    var pageAll = 0;
    for(var i=p_pageJson.length;i--;){
      if(p_pageJson[i].id==id){
        pageAll=p_pageJson[i].page;
        if(index!==undefined){
          index=i;
        }
      }
    }
    if(pageAll==0){
      console.log("id错误");
    }else{
      console.log("id:"+id+"开始，共"+pageAll+"页")
      getPicLun(p_fengye,~~(pageAll/p_fengye)+1,id,index);
    }
  }
  var getPicLun = function(Length,lunNum,idname,pageindex){
      if(!idname||!Length||!lunNum){return;}
      mkdirPath(p_crawlUrl);
      var pub_liunNow=1,
          pub_allList=[],
          pub_oldList=0,
          pub_repeat={};

      var getPic = function(start,end,lunObj){
        var btime = +new Date,
            urls_1=[];
        for(var i = start; i < end; i++) {
          urls_1.push('http://' + p_crawlUrl + p_locPage.replace('{{id}}', idname).replace('{{num}}', i));
        }
        async.mapLimit(urls_1, p_bingfa, function(url_1, callback) {
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
          
          console.log(idname+":"+start+'~' + (end-1) + '页，共' + (pub_allList.length-pub_oldList) + '有用链接，用时'+((new Date)-btime)/1000+'秒。');
          pub_oldList=pub_allList.length;
          if(lunObj&&lunObj.lunNum>=(++pub_liunNow)){
              getPic(start+lunObj.Length,end+lunObj.Length,lunObj);
          }else{
            save(idname+".json",JSON.stringify(pub_allList));
            //console.log(pub_allList)
            console.log('一共' + pub_allList.length + '有用链接，'+((new Date)-atime)/1000+'秒。');
            pageindex++;
            if(pageindex!==undefined&&pageindex<p_pageJson.length){
              getByPageId(p_pageJson[pageindex].id,pageindex);
            }
          }
        });
      }

      getPic(1,Length+1,{
        Length:Length,
        lunNum:lunNum
      });
  }

  
  var reload_index = function(){
    console.log("原有");
    getPageCount(p_pageJson);
    var urls_1=[],pub_allList=[];
    for(var i = 0; i < 100; i++) {
      urls_1.push(i);
    }
    async.mapLimit(urls_1, p_bingfa, function(url_1, callback) {
      superagent.get('http://'+p_crawlUrl+'/article-list-id-{{list}}-page-1.html'.replace('{{list}}', url_1)).end(function(err, sres) {
        if(sres){
          var $ = cheerio.load(sres.text)
          var href=$(".end").text();
          if(href>0){
            pub_allList.push({
              id:url_1,
              page:href,
              name:$(".place a").text()
            });
          }else if($(".num").length>0){
            href=$(".num").eq($(".num").length-1).text();
            if(href>0){
              pub_allList.push({
                id:url_1,
                page:href,
                name:$(".place a").text()
              });
            }
          }
        }
        callback(null)
      });
    }, function(err, result) {      
      save(p_indexName,JSON.stringify(pub_allList));
      console.log("新生成");
      getPageCount(pub_allList)
      console.log("用时"+((new Date)-atime)/1000+'秒。');
    });
  }

  var getPageCount=function(allJson) {
    var pagecount=0;
    for(var i=allJson.length;i--;){
      pagecount+=(+allJson[i].page);
    }
    console.log("获取"+allJson.length+"个大类，共"+pagecount+"页");

  }

  return{
    reload_index:reload_index,//刷新index页面
    getPicLun:getPicLun,//.getPicLun(100,12)
    getByPageId:getByPageId//.getByPageId(6) 不传id就是全部
  }
}

var x=main();
//x.reload_index();
//x.getPicLun(100,12);
x.getByPageId(52,1)
