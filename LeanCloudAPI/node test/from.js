var http = require("http");
var fs = require("fs");

var boundary = "----WebKitFormBoundarynxPMtWVl5BfuAAxw";
var formStr =  '--'+boundary
        + '\r\nContent-Disposition: form-data; name="user[email]"\r\n\r\n'
        + 'glb127@163.com'
        + '\r\n--' + boundary + '\r\n'
        + 'Content-Disposition: form-data; name="user[pwd]"\r\n\r\n'
        + '87275465'
        + '\r\n--' + boundary + '\r\n'
        + 'Content-Disposition: form-data; name="user[remember]"\r\n\r\n'
        + '1'
        + '\r\n--' + boundary + '\r\n'
        + 'Content-Disposition: form-data; name="type"\r\n\r\n'
        + 'login'
        + '\r\n--' + boundary + '\r\n'
        + 'Content-Disposition: form-data; name="theme-nonce"\r\n\r\n'
        + '111fc2ea98'
        + '\r\n--' + boundary + '\r\n'

 
var formEnd = '\r\n--' + boundary + '--\r\n';
var options = {
    host : "a.acgluna.com",
    port : 80,
    method : "POST",
    path : "/wp-admin/admin-ajax.php?action=theme_custom_sign",
    headers : {
        "Content-Type" : "multipart/form-data; boundary=" + boundary,
        "Content-Length" : formStr.length  + formEnd.length,
        "Referer":" http://a.acgluna.com/sign?redirect=%2F%2Fa.acgluna.com%2Fsign%3Fredirect%3D%252F%252Fa.acgluna.com%252Farchives%252Fauthor%252F196687"
    }
};
 
var req = http.request(options, function(res) {
    res.on("data", function(data) {
        console.log("返回数据" + data);
    });
});
 
req.write(formStr);
req.write(formEnd);
req.end();