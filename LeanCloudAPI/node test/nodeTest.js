

// 引入依赖
var superagent = require('superagent'),
	cheerio = require('cheerio'),
	eventproxy = require('eventproxy'),
	url = require('url'),
	async = require('async'),
	fs = require("fs") ;

function save(fileName,info){
	fs.writeFile("book/"+fileName,info,function (err) {
	     if (err) throw err ;
	     console.log(fileName+" Saved !"); //文件被保存
	}) ;
}

	var cnodeUrl = 'http://www.w3cfuns.com/notes/page/1.html';
	superagent.get(cnodeUrl).end(function(err, sres) {
		var ep = new eventproxy();
		var $ = cheerio.load(sres.text);
		var topicUrls = [];
		var domObj=$(".media-heading :nth-child(3n)");
		for(var i=0;i<domObj.length;i++){
			topicUrls.push(url.resolve(cnodeUrl, domObj.eq(i).attr('href')))
		}
		save("a.txt",topicUrls);

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
				//console.log($(".editor_content"))
				urls.push($(".editor_content").html())
				return urls;
			});
			
		});
	});


	// var cnodeUrl = 'http://www.baiduyuns.com/forum-36-1.html';
	// superagent.get(cnodeUrl).end(function(err, sres) {
	// 	var ep = new eventproxy();
	// 	var $ = cheerio.load(sres.text);
	// 	var topicUrls = [];
	// 	var domObj=$('.xst');
	// 	for(var i=0;i<domObj.length;i++){
	// 		if(domObj.eq(i)&&domObj.eq(i).parent().attr('class')=="new"){
	// 			topicUrls.push(url.resolve(cnodeUrl, domObj.eq(i).attr('href')))
	// 		}
	// 	}
	// 	if(topicUrls.length>5){ topicUrls.length=5; }	
	// 	async.mapLimit(topicUrls, 5, function(topicUrl, callback) {
	// 		superagent.get(topicUrl)
	// 		.end(function(err, res) {
	// 			ep.emit('topic_html', [topicUrl, res.text]);
	// 		});
	// 	}, function(err, result) {
	// 		console.log('final:'+result);
	// 	});

	// 	ep.after('topic_html', topicUrls.length, function(topics) {
	// 		var urls = [];
	// 		topics.map(function(topicPair) {
	// 			var $ = cheerio.load(topicPair[1]);
	// 			$('.t_f').each(function(idx, element) {
	// 				var _url=$(element).text().match( /https:\/\/pan.baidu.com\/[\w\/\.?=]*/gi)
	// 				var time = $(element).parent().parent().parent().parent().parent().parent().parent().find(".pi .authi em").text();
	// 				time = time.replace("发表于 ","");
	// 				if(_url&&_url.length>0){
	// 					urls.push({url:_url[0],time:time});
	// 				}
	// 			});
	// 			return urls;
	// 		});
	// 		console.log(urls);
	// 	});
	// });

