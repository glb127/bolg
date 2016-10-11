var charset = require('superagent-charset'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    cheerioAdv = require('cheerio-advanced-selectors'),
    url = require('url'),
    fs = require("fs") ,
    request = require("request"),
    async = require('async');

cheerio = cheerioAdv.wrap(cheerio)
charset(superagent)




  function main(){
    var optionName,
      aTime = +new Date,
      errorList=[],
      optionNameList=[],
      option={},
      listCatch={0:[],1:[],2:[],3:[],4:[],5:[]};
    if(typeof response != "undefined"){
      optionName = request.params.name;
    }else{
      optionName = process.argv.splice(2)[0];
    }

    var responseFunction = function(str){
      if(!str){
        response.success("");
      }
      if(str.length<1000){
        console.log(str);
      }
      if(typeof response != "undefined"){
        response.success(str);
      }
    }

    //初始化
    var start = function(){
      mkdirPath("log");
      mkdirPath("json");
      mkdirPath("config");
      if(option.save){
        mkdirPath("json/"+optionName);
      }
      explorer("config");
      setTimeout(getConfig,100);

    }

    var getConfig=function () {
      var zlog;
      if(!optionName){
        responseFunction("请输入参数（"+optionNameList.toString()+"）");
        return;
      }else if(optionName=="log"){
        var str="";
        async.mapLimit(optionNameList, 1, function (urlObj, callback) {
          try{
            zlog=require('./log/l_'+urlObj+'.json');
            str+=urlObj+'：上次共 '+zlog.len+' 个，花费 '+zlog.time+' 秒，错误 '+zlog.error.length+' 个，时间'+zlog.now+' \n';
            callback();
          } catch (e) {
            callback();
          }
        }, function (err, result) {
          responseFunction(str);
        });
        return;
      }else if(optionNameList.indexOf(optionName)==-1){
        responseFunction("请输入参数（"+optionNameList.toString()+"）");
        return;
      }
      option=require('./config/c_'+optionName+'.json');

      if(!option){
        responseFunction("option为空");
        return;
      }else if(option.dom.length<0){
        responseFunction("dom为空");
        return;
      }
      option.charset=option.charset||"utf-8";
      option.bingfa=option.bingfa||10;

      try{
        zlog=require('./log/l_'+optionName+'.json');
      } catch (e) {

      }
      if(zlog){
        console.log('上次共 %d 个，花费 %d 秒，错误 %d 个，时间 %s',zlog.len,zlog.time,zlog.error.length,zlog.now);
      }

      getUrlList()
    }

    var explorer=function(path){
      fs.readdir(path, function(err, files){
        //err 为错误 , files 文件名列表包含文件夹与文件
        if(err){
          responseFunction('error:\n' + err);
          return;
        }
        files.forEach(function(file){
          fs.stat(path + '/' + file, function(err, stat){
            if(err){console.log(err); return;}
            if(stat.isDirectory()){
              explorer(path + '/' + file);
            }else{
              optionNameList.push(file.substring(2,file.length-5));
            }
          });
        });
      });
    }


    var toTwo = function(str){
      str=str+"";
      if(str.length==1){
        return "0"+str;
      }else{
        return str;
      }
    }

    //路径生成
    var mkdirPath = function(loc) {
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
    //保存文件
    var save = function(fileName, info, callback) {
      fs.writeFile(fileName, info, function(err) {
        if(err) console.log(err);
        if(callback){
          callback(null);
        }
      });
    }
    //保存图片
    var saveImg = function(filename,url,dir,callback){
      filename = filename.replace(/[/\\:*?<>\"|]/g, "");
      var writeStream =fs.createWriteStream(dir+ "/" + filename)
      request(url).pipe(writeStream);
      writeStream.on('finish', function(){
        if(callback){
          callback(null);
        }
      });
    }
    //获取循环
    var getUrlList = function(index){
      index=index||0;
      if(!option.dom[index]){
        responseFunction("dom："+index+"，为空");
        return;
      } else if(option.dom[index].limit.split("~").length==2){
        for(var i=option.dom[index].limit.split("~")[0];i<option.dom[index].limit.split("~")[1];i++){
          listCatch[index].push({
            index:i+"",
            url:option.dom[index].url.replace("{{index}}",i)
          });
        }
        getUrlInfo(index)
      } else if(option.dom[index].limit){
        for(var i=0;i<option.dom[index].limit.split(",").length;i++){
          listCatch[index].push({
            index:i+"",
            url:option.dom[index].url.replace("{{index}}",option.dom[index].limit.split(",")[i])
          });
        }
        getUrlInfo(index)
      }else{
        responseFunction("limit："+index+"，为空");
        return;
      }
    }
    function getUrlInfo(index) {
      index=index||0;
      async.mapLimit(listCatch[index], option.bingfa, function (urlObj, callback) {
        superagent.get(urlObj.url).timeout(10000).redirects(0).charset(option.charset).end(function(err, sres) {
          if(sres){
            var $ = cheerio.load(sres.text);
            if(option.dom[index].href){
              var hrefList = $(option.dom[index].href);
              for(var i=0;i<hrefList.length;i++){
                var objCatch={};
                objCatch.index = urlObj.index+toTwo(i);
                objCatch.url = url.resolve(urlObj.url, hrefList.eq(i).attr("href"));
                objCatch.title = hrefList.eq(i).text();
                listCatch[index+1].push(objCatch)
              }
            }else{
              if(option.dom[index].remove){
                $(option.dom[index].remove).remove();
              }
              var objCatch={};
              objCatch.index = toTwo(urlObj.index);
              if(option.dom[index].baseurl){
                objCatch.url = urlObj.url;
              }
              if(option.dom[index].title){
                objCatch.title = $(option.dom[index].title).text();
              }
              if(option.dom[index].info){
                var _info = option.dom[index].info.split(",");
                if(_info.length==1){
                  objCatch.info = $(_info[0]).html()
                }else{
                  objCatch.info="";
                  for(var i=0;i<_info.length;i++){
                    objCatch.info+=$(_info[i]).html()+"</br>";
                  }
                }
              }
              if(option.dom[index].oinfo){
                objCatch.oinfo={}
                for(var ent in option.dom[index].oinfo){
                  if(ent.substr(0,1)=="_"){
                    objCatch.oinfo[ent] = $(option.dom[index].oinfo[ent]).html();
                  }else{
                    objCatch.oinfo[ent] = $(option.dom[index].oinfo[ent]).text();
                  }

                }
              }
              if(option.dom[index].title&&!objCatch.title){
              }else if(option.dom[index].info&&!objCatch.info){
              }else{
                listCatch[index+1].push(objCatch);
              }
            }
            if(option.dom[index].save){
              if(option.dom[index].save.type=="img"){
                if($(option.dom[index].save.dom).attr("src")){
                  saveImg($(option.dom[index].save.name).text()+".png",$(option.dom[index].save.dom).attr("src"),"json/"+optionName,callback)
                  return;
                }else if($(option.dom[index].save.dom2).attr("src")){
                  saveImg("b"+$(option.dom[index].save.name).text()+".png",$(option.dom[index].save.dom2).attr("src"),"json/"+optionName,callback)
                  return;
                }
              }
            }
            callback(null);
          }else{
            console.log("error："+urlObj.url);
            errorList.push(urlObj.url);
            callback(null);
          }
        });
      }, function (err, result) {
        if(option.dom[index+1]){
          getUrlInfo(index+1);
          console.log('step'+index+'，'+(new Date-aTime)/1000+"秒");
        }else{
          var saveList = listCatch[index+1].sort(function(a,b){return a.index-b.index;});
          for(var i=0;i<saveList.length;i++){
            saveList[i].index=i+1;
          }
          save("json/"+optionName+".json",JSON.stringify(saveList));
          var zlog={
            len:saveList.length,
            time:(new Date-aTime)/1000,
            error:errorList,
            now:(new Date).toLocaleString()
          }
          save("log/l_"+optionName+".json",JSON.stringify(zlog));
          console.log('全部结束，共%d个,%d秒',zlog.len,zlog.time);
          responseFunction(JSON.stringify(saveList))
        }
      });
    }

    return{
      start:start
    }
  }


  var x=main();
  x.start();




