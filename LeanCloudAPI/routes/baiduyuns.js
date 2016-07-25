'use strict';
var router = require('express').Router();
var AV = require('leanengine');

// `AV.Object.extend` 方法一定要放在全局变量，否则会造成堆栈溢出。
// 详见： https://leancloud.cn/docs/js_guide.html#对象
var Todo = AV.Object.extend('Todo');

// 查询 Todo 列表
router.get('/', function(req, res, next) {
  AV.Cloud.run('baiduyuns', {}, {
    success: function(data) {
      data.sort(function(a,b){return new Date(b.time)-new Date(a.time)});
      var chongfu={};
      for(var i=data.length;i--;){
        if(chongfu[data[i].url]){
          data.splice(i,1);
        }else{
          chongfu[data[i].url]=1;
        }
      }
      var str="";
      for(var i=0;i<data.length;i++){
        str+='<br/><a href="'+data[i].url+'" target="_blank">'+data[i].time+"</a>";
      }
      res.render('baiduyuns', {
        title: '百度云 列表',
        html: str
      });
    }
  });

});

// 新增 Todo 项目
router.post('/', function(req, res, next) {
  var content = req.body.content;
  var todo = new Todo();
  todo.set('content', content);
  todo.save().then(function(todo) {
    res.redirect('/baiduyuns');
  }).catch(next);
});

module.exports = router;
