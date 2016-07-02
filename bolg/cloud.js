
var AV = require('leanengine');
// 引入依赖
var superagent = require('superagent'),
	cheerio = require('cheerio'),
	eventproxy = require('eventproxy'),
	url = require('url'),
	async = require('async');

AV.Cloud.define('baiduyuns', function(request, response) {
	var cnodeUrl = 'http://www.baiduyuns.com/forum-36-1.html';
	superagent.get(cnodeUrl).end(function(err, sres) {
		var ep = new eventproxy();
		var $ = cheerio.load(sres.text);
		var topicUrls = [];
		var domObj=$('.xst');
		for(var i=0;i<domObj.length;i++){
			if($('.xst').eq(i)&&$('.xst').eq(i).parent().attr('class')=="new"){
				topicUrls.push(url.resolve(cnodeUrl, $('.xst').eq(i).attr('href')))
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
			var newDate = new Date("2016-7-1 00:00");
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

AV.Cloud.define('hello', function(request, response) {
	response.success('Hello world one!');
});

AV.Cloud.define('retData', function(request, response) {
	response.success('Data:'+JSON.stringify(request.params));
});

module.exports = AV.Cloud;



