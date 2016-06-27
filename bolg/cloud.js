var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request, response) {
	response.success('Hello world!');
});

AV.Cloud.define('retData', function(request, response) {
	response.success('Data:'+JSON.stringify(request.params));
});

module.exports = AV.Cloud;
