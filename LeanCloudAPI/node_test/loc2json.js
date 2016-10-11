var fs = require("fs") ;


function main(){
	var processLoc=process.argv.splice(2)[0];
		locList=[],
		atime=new Date,
		picType=["png","gif","jpg"],
		count=0,
		maxcount=1;
	//保存文件
    var save = function(dir, info) {
      fs.writeFile(dir, info, function(err) {
        if(err) console.log(err);
      });
    }
	var explorer=function(path){
		fs.readdir(path, function(err, files){
			if(err){console.log(err);return;}
			maxcount+=files.length;
			count++;
			files.forEach(function(file){
				fs.stat(path + '/' + file, function(err, stat){
					if(err){console.log(err); return;}
					if(stat.isDirectory()){
						explorer(path + '/' + file);
					}else{
						count++;
						if(picType.indexOf(file.slice(-3))>-1){
							locList.push(path.replace(processLoc,"") + '/' + file);
						}
						if(count==maxcount){
							locList.sort(function(a,b){return a.localeCompare(b);});
							save("C:/git-demo/bolg-server/src/no-min/picfall.json",JSON.stringify(locList))
							console.log(locList.length+","+(new Date-atime)/1000);
						}
					}
				});
			});
		});
	}
	var change = function () {
		if(!processLoc){
			processLoc = "C:/git-demo/bolg-server/src/no-min/picfall";
		}
		explorer(processLoc);
	}
	return {change:change}
}


var x=main();
x.change();
