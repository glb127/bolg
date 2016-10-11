var   fs = require("fs");
var selsectName = process.argv.splice(2)[0];

var save=function(fileName, info) {
	fs.writeFile(fileName, info, function(err) {
		if(err) console.log(err);
	});
}
var json=require("./select.json");

function select(str){
	str=str.toLowerCase();
	var catchList = [];

	var json=require("./select.json");
	var at=new Date;
	for(var i=0;i<json.length;i++){
		if(json[i].a.indexOf(str)>-1){
			catchList.push(json[i]);
		}
	}
	if(catchList.length>50){
		catchList.length=50;
	}
	console.log(catchList)
}

select(selsectName)



