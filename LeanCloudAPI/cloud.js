
var AV = require('leanengine');
// 引入依赖
var superagent = require('superagent'),
	cheerio = require('cheerio'),
	eventproxy = require('eventproxy'),
	url = require('url'),
	async = require('async');

AV.Cloud.define('film66', function(request, response) {
	
  var bingfa = 10,
  	minId = 1600,
    maxId = 2000,
    crawlUrl = "www.renren66.com",
    locPage = "/movie/id_{{num}}.html",
    btime = +new Date,
    urls_1 = [],
    allFilmList = [];;

  for(var i = minId; i < maxId; i++) {
    urls_1.push('http://' + crawlUrl + locPage.replace('{{num}}', i));
  }

  var emptyCount = 0;
  var fetchUrl = function(url_1, callback) {
    if(emptyCount>bingfa){    
        callback(null);
        return;
    }
    superagent.get(url_1).end(function(err, sres) {
      var $ = cheerio.load(sres.text);
      if($("[data-thread-key]").length==0){
        emptyCount++;
        callback(null);
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
    response.success(allFilmList);
  });
});


AV.Cloud.define('baiduyuns', function(request, response) {
	var cnodeUrl = 'http://www.baiduyuns.com/forum-36-1.html';
	superagent.get(cnodeUrl).end(function(err, sres) {
		var ep = new eventproxy();
		var $ = cheerio.load(sres.text);
		var topicUrls = [];
		var domObj=$('.xst');
		for(var i=0;i<domObj.length;i++){
			if(domObj.eq(i)&&domObj.eq(i).parent().attr('class')=="new"){
				topicUrls.push(url.resolve(cnodeUrl, domObj.eq(i).attr('href')))
			}
		}
		if(topicUrls.length>5){ topicUrls.length=5; }	
		async.mapLimit(topicUrls, 5, function(topicUrl, callback) {
			superagent.get(topicUrl)
			.end(function(err, res) {
				ep.emit('topic_html', [topicUrl, res.text]);
			});
		}, function(err, result) {
			console.log('final:'+result);
		});

		ep.after('topic_html', topicUrls.length, function(topics) {
			var urls = [];
			topics.map(function(topicPair) {
				var $ = cheerio.load(topicPair[1]);
				$('.t_f').each(function(idx, element) {
					var _url=$(element).text().match( /https:\/\/pan.baidu.com\/[\w\/\.?=]*/gi)
					var time = $(element).parent().parent().parent().parent().parent().parent().parent().find(".pi .authi em").text();
					time = time.replace("发表于 ","");
					if(_url&&_url.length>0){
						urls.push({url:_url[0],time:time});
					}
				});
				return urls;
			});
			response.success(urls);
		});
	});
});

AV.Cloud.define('w3cfun', function(request, response) {
	var cnodeUrl = 'http://www.w3cfuns.com/notes/page/1.html';
	superagent.get(cnodeUrl).end(function(err, sres) {
		var ep = new eventproxy();
		var $ = cheerio.load(sres.text);
		var topicUrls = [];
		var domObj=$(".media-heading :nth-child(3n)");
		for(var i=0;i<domObj.length;i++){
			topicUrls.push(url.resolve(cnodeUrl, domObj.eq(i).attr('href')))
		}
		if(topicUrls.length>5){ topicUrls.length=5; }	

		async.mapLimit(topicUrls, 5, function(topicUrl, callback) {
			superagent.get(topicUrl).end(function(err, res) {
				ep.emit('topic_html', [topicUrl, res.text]);
			});
		}, function(err, result) {
			console.log('final:'+result);
		});

		ep.after('topic_html', topicUrls.length, function(topics) {
			var urls = [];
			topics.map(function(topicPair) {
				var $ = cheerio.load(topicPair[1]);
				console.log($(".editor_content"))
				urls.push($(".editor_content").html())
				return urls;
			});
			response.success(urls);
		});
	});
});

AV.Cloud.define('hello', function(request, response) {
	response.success('Hello world one!');
});

AV.Cloud.define('retData', function(request, response) {
	response.success('Data:'+JSON.stringify(request.params));
});


module.exports = AV.Cloud;



