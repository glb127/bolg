var fs = require("fs") ,
    qiniu = require("qiniu");

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'm1taaUEk6w0oHhdSW0L_fS7ArpwAfugbH3XT76_f';
qiniu.conf.SECRET_KEY = 'hz0B3GVLs0jX6WxcwLsA5FXYPsw4IzG5dJfSrxYX';

var qiniuLoc="za/"

//构造上传函数
function uploadFile(bucket, key, localFile) {

  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  var uptoken = putPolicy.token();
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log(ret.hash, ret.key, ret.persistentId);
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
}
var explorer=function(path){
  fs.readdir(path, function(err, files){
    //err 为错误 , files 文件名列表包含文件夹与文件
    if(err){
      console.log('error:\n' + err);
      return;
    }
    files.forEach(function(file){
      fs.stat(path + '/' + file, function(err, stat){
        if(err){console.log(err); return;}
        if(stat.isDirectory()){
          explorer(path + '/' + file);
        }else{
          uploadFile('glb127', qiniuLoc+file, path + '/' + file);
        }
      });
    });
  });
}
// explorer("json")

uploadFile('glb127', "1.png", "http://pic.anhuinews.com/003/001/645/00300164549_51a58d04.png");
