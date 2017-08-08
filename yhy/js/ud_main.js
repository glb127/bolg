//lrz.all.bundle.js
!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var i=n[r]={exports:{},id:r,loaded:!1};return e[r].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){n(6),n(7),e.exports=n(8)},function(e,t,n){(function(t){!function(n){function r(e,t){return function(){e.apply(t,arguments)}}function i(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=null,this._value=null,this._deferreds=[],l(e,r(a,this),r(s,this))}function o(e){var t=this;return null===this._state?void this._deferreds.push(e):void f(function(){var n=t._state?e.onFulfilled:e.onRejected;if(null===n)return void(t._state?e.resolve:e.reject)(t._value);var r;try{r=n(t._value)}catch(i){return void e.reject(i)}e.resolve(r)})}function a(e){try{if(e===this)throw new TypeError("A promise cannot be resolved with itself.");if(e&&("object"==typeof e||"function"==typeof e)){var t=e.then;if("function"==typeof t)return void l(r(t,e),r(a,this),r(s,this))}this._state=!0,this._value=e,u.call(this)}catch(n){s.call(this,n)}}function s(e){this._state=!1,this._value=e,u.call(this)}function u(){for(var e=0,t=this._deferreds.length;t>e;e++)o.call(this,this._deferreds[e]);this._deferreds=null}function c(e,t,n,r){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof t?t:null,this.resolve=n,this.reject=r}function l(e,t,n){var r=!1;try{e(function(e){r||(r=!0,t(e))},function(e){r||(r=!0,n(e))})}catch(i){if(r)return;r=!0,n(i)}}var f="function"==typeof t&&t||function(e){setTimeout(e,1)},d=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)};i.prototype["catch"]=function(e){return this.then(null,e)},i.prototype.then=function(e,t){var n=this;return new i(function(r,i){o.call(n,new c(e,t,r,i))})},i.all=function(){var e=Array.prototype.slice.call(1===arguments.length&&d(arguments[0])?arguments[0]:arguments);return new i(function(t,n){function r(o,a){try{if(a&&("object"==typeof a||"function"==typeof a)){var s=a.then;if("function"==typeof s)return void s.call(a,function(e){r(o,e)},n)}e[o]=a,0===--i&&t(e)}catch(u){n(u)}}if(0===e.length)return t([]);for(var i=e.length,o=0;o<e.length;o++)r(o,e[o])})},i.resolve=function(e){return e&&"object"==typeof e&&e.constructor===i?e:new i(function(t){t(e)})},i.reject=function(e){return new i(function(t,n){n(e)})},i.race=function(e){return new i(function(t,n){for(var r=0,i=e.length;i>r;r++)e[r].then(t,n)})},i._setImmediateFn=function(e){f=e},i.prototype.always=function(e){var t=this.constructor;return this.then(function(n){return t.resolve(e()).then(function(){return n})},function(n){return t.resolve(e()).then(function(){throw n})})},"undefined"!=typeof e&&e.exports?e.exports=i:n.Promise||(n.Promise=i)}(this)}).call(t,n(2).setImmediate)},function(e,t,n){(function(e,r){function i(e,t){this._id=e,this._clearFn=t}var o=n(3).nextTick,a=Function.prototype.apply,s=Array.prototype.slice,u={},c=0;t.setTimeout=function(){return new i(a.call(setTimeout,window,arguments),clearTimeout)},t.setInterval=function(){return new i(a.call(setInterval,window,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(window,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout(function(){e._onTimeout&&e._onTimeout()},t))},t.setImmediate="function"==typeof e?e:function(e){var n=c++,r=arguments.length<2?!1:s.call(arguments,1);return u[n]=!0,o(function(){u[n]&&(r?e.apply(null,r):e.call(null),t.clearImmediate(n))}),n},t.clearImmediate="function"==typeof r?r:function(e){delete u[e]}}).call(t,n(2).setImmediate,n(2).clearImmediate)},function(e,t){function n(){c=!1,a.length?u=a.concat(u):l=-1,u.length&&r()}function r(){if(!c){var e=setTimeout(n);c=!0;for(var t=u.length;t;){for(a=u,u=[];++l<t;)a&&a[l].run();l=-1,t=u.length}a=null,c=!1,clearTimeout(e)}}function i(e,t){this.fun=e,this.array=t}function o(){}var a,s=e.exports={},u=[],c=!1,l=-1;s.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];u.push(new i(e,t)),1!==u.length||c||setTimeout(r,0)},i.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=o,s.addListener=o,s.once=o,s.off=o,s.removeListener=o,s.removeAllListeners=o,s.emit=o,s.binding=function(e){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},function(e,t){function n(){var e=~navigator.userAgent.indexOf("Android")&&~navigator.vendor.indexOf("Google")&&!~navigator.userAgent.indexOf("Chrome");return e&&navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop()<=534||/MQQBrowser/g.test(navigator.userAgent)}var r=function(){try{return new Blob,!0}catch(e){return!1}}()?window.Blob:function(e,t){var n=new(window.BlobBuilder||window.WebKitBlobBuilder||window.MSBlobBuilder||window.MozBlobBuilder);return e.forEach(function(e){n.append(e)}),n.getBlob(t?t.type:void 0)},i=function(){function e(){var e=this,n=[],i=Array(21).join("-")+(+new Date*(1e16*Math.random())).toString(36),o=XMLHttpRequest.prototype.send;this.getParts=function(){return n.toString()},this.append=function(e,t,r){n.push("--"+i+'\r\nContent-Disposition: form-data; name="'+e+'"'),t instanceof Blob?(n.push('; filename="'+(r||"blob")+'"\r\nContent-Type: '+t.type+"\r\n\r\n"),n.push(t)):n.push("\r\n\r\n"+t),n.push("\r\n")},t++,XMLHttpRequest.prototype.send=function(a){var s,u,c=this;a===e?(n.push("--"+i+"--\r\n"),u=new r(n),s=new FileReader,s.onload=function(){o.call(c,s.result)},s.onerror=function(e){throw e},s.readAsArrayBuffer(u),this.setRequestHeader("Content-Type","multipart/form-data; boundary="+i),t--,0==t&&(XMLHttpRequest.prototype.send=o)):o.call(this,a)}}var t=0;return e.prototype=Object.create(FormData.prototype),e}();e.exports={Blob:r,FormData:n()?i:FormData}},function(e,t,n){var r,i;(function(){function n(e){return!!e.exifdata}function o(e,t){t=t||e.match(/^data\:([^\;]+)\;base64,/im)[1]||"",e=e.replace(/^data\:([^\;]+)\;base64,/gim,"");for(var n=atob(e),r=n.length,i=new ArrayBuffer(r),o=new Uint8Array(i),a=0;r>a;a++)o[a]=n.charCodeAt(a);return i}function a(e,t){var n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="blob",n.onload=function(e){(200==this.status||0===this.status)&&t(this.response)},n.send()}function s(e,t){function n(n){var r=u(n),i=c(n);e.exifdata=r||{},e.iptcdata=i||{},t&&t.call(e)}if(e.src)if(/^data\:/i.test(e.src)){var r=o(e.src);n(r)}else if(/^blob\:/i.test(e.src)){var i=new FileReader;i.onload=function(e){n(e.target.result)},a(e.src,function(e){i.readAsArrayBuffer(e)})}else{var s=new XMLHttpRequest;s.onload=function(){200==this.status||0===this.status?n(s.response):t(new Error("Could not load image")),s=null},s.open("GET",e.src,!0),s.responseType="arraybuffer",s.send(null)}else if(window.FileReader&&(e instanceof window.Blob||e instanceof window.File)){var i=new FileReader;i.onload=function(e){p&&console.log("Got file of length "+e.target.result.byteLength),n(e.target.result)},i.readAsArrayBuffer(e)}}function u(e){var t=new DataView(e);if(p&&console.log("Got file of length "+e.byteLength),255!=t.getUint8(0)||216!=t.getUint8(1))return p&&console.log("Not a valid JPEG"),!1;for(var n,r=2,i=e.byteLength;i>r;){if(255!=t.getUint8(r))return p&&console.log("Not a valid marker at offset "+r+", found: "+t.getUint8(r)),!1;if(n=t.getUint8(r+1),p&&console.log(n),225==n)return p&&console.log("Found 0xFFE1 marker"),g(t,r+4,t.getUint16(r+2)-2);r+=2+t.getUint16(r+2)}}function c(e){var t=new DataView(e);if(p&&console.log("Got file of length "+e.byteLength),255!=t.getUint8(0)||216!=t.getUint8(1))return p&&console.log("Not a valid JPEG"),!1;for(var n=2,r=e.byteLength,i=function(e,t){return 56===e.getUint8(t)&&66===e.getUint8(t+1)&&73===e.getUint8(t+2)&&77===e.getUint8(t+3)&&4===e.getUint8(t+4)&&4===e.getUint8(t+5)};r>n;){if(i(t,n)){var o=t.getUint8(n+7);o%2!==0&&(o+=1),0===o&&(o=4);var a=n+8+o,s=t.getUint16(n+6+o);return l(e,a,s)}n++}}function l(e,t,n){for(var r,i,o,a,s,u=new DataView(e),c={},l=t;t+n>l;)28===u.getUint8(l)&&2===u.getUint8(l+1)&&(a=u.getUint8(l+2),a in S&&(o=u.getInt16(l+3),s=o+5,i=S[a],r=h(u,l+5,o),c.hasOwnProperty(i)?c[i]instanceof Array?c[i].push(r):c[i]=[c[i],r]:c[i]=r)),l++;return c}function f(e,t,n,r,i){var o,a,s,u=e.getUint16(n,!i),c={};for(s=0;u>s;s++)o=n+12*s+2,a=r[e.getUint16(o,!i)],!a&&p&&console.log("Unknown tag: "+e.getUint16(o,!i)),c[a]=d(e,o,t,n,i);return c}function d(e,t,n,r,i){var o,a,s,u,c,l,f=e.getUint16(t+2,!i),d=e.getUint32(t+4,!i),g=e.getUint32(t+8,!i)+n;switch(f){case 1:case 7:if(1==d)return e.getUint8(t+8,!i);for(o=d>4?g:t+8,a=[],u=0;d>u;u++)a[u]=e.getUint8(o+u);return a;case 2:return o=d>4?g:t+8,h(e,o,d-1);case 3:if(1==d)return e.getUint16(t+8,!i);for(o=d>2?g:t+8,a=[],u=0;d>u;u++)a[u]=e.getUint16(o+2*u,!i);return a;case 4:if(1==d)return e.getUint32(t+8,!i);for(a=[],u=0;d>u;u++)a[u]=e.getUint32(g+4*u,!i);return a;case 5:if(1==d)return c=e.getUint32(g,!i),l=e.getUint32(g+4,!i),s=new Number(c/l),s.numerator=c,s.denominator=l,s;for(a=[],u=0;d>u;u++)c=e.getUint32(g+8*u,!i),l=e.getUint32(g+4+8*u,!i),a[u]=new Number(c/l),a[u].numerator=c,a[u].denominator=l;return a;case 9:if(1==d)return e.getInt32(t+8,!i);for(a=[],u=0;d>u;u++)a[u]=e.getInt32(g+4*u,!i);return a;case 10:if(1==d)return e.getInt32(g,!i)/e.getInt32(g+4,!i);for(a=[],u=0;d>u;u++)a[u]=e.getInt32(g+8*u,!i)/e.getInt32(g+4+8*u,!i);return a}}function h(e,t,n){var r,i="";for(r=t;t+n>r;r++)i+=String.fromCharCode(e.getUint8(r));return i}function g(e,t){if("Exif"!=h(e,t,4))return p&&console.log("Not valid EXIF data! "+h(e,t,4)),!1;var n,r,i,o,a,s=t+6;if(18761==e.getUint16(s))n=!1;else{if(19789!=e.getUint16(s))return p&&console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)"),!1;n=!0}if(42!=e.getUint16(s+2,!n))return p&&console.log("Not valid TIFF data! (no 0x002A)"),!1;var u=e.getUint32(s+4,!n);if(8>u)return p&&console.log("Not valid TIFF data! (First offset less than 8)",e.getUint32(s+4,!n)),!1;if(r=f(e,s,s+u,v,n),r.ExifIFDPointer){o=f(e,s,s+r.ExifIFDPointer,w,n);for(i in o){switch(i){case"LightSource":case"Flash":case"MeteringMode":case"ExposureProgram":case"SensingMethod":case"SceneCaptureType":case"SceneType":case"CustomRendered":case"WhiteBalance":case"GainControl":case"Contrast":case"Saturation":case"Sharpness":case"SubjectDistanceRange":case"FileSource":o[i]=b[i][o[i]];break;case"ExifVersion":case"FlashpixVersion":o[i]=String.fromCharCode(o[i][0],o[i][1],o[i][2],o[i][3]);break;case"ComponentsConfiguration":o[i]=b.Components[o[i][0]]+b.Components[o[i][1]]+b.Components[o[i][2]]+b.Components[o[i][3]]}r[i]=o[i]}}if(r.GPSInfoIFDPointer){a=f(e,s,s+r.GPSInfoIFDPointer,y,n);for(i in a){switch(i){case"GPSVersionID":a[i]=a[i][0]+"."+a[i][1]+"."+a[i][2]+"."+a[i][3]}r[i]=a[i]}}return r}var p=!1,m=function(e){return e instanceof m?e:this instanceof m?void(this.EXIFwrapped=e):new m(e)};"undefined"!=typeof e&&e.exports&&(t=e.exports=m),t.EXIF=m;var w=m.Tags={36864:"ExifVersion",40960:"FlashpixVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",37121:"ComponentsConfiguration",37122:"CompressedBitsPerPixel",37500:"MakerNote",37510:"UserComment",40964:"RelatedSoundFile",36867:"DateTimeOriginal",36868:"DateTimeDigitized",37520:"SubsecTime",37521:"SubsecTimeOriginal",37522:"SubsecTimeDigitized",33434:"ExposureTime",33437:"FNumber",34850:"ExposureProgram",34852:"SpectralSensitivity",34855:"ISOSpeedRatings",34856:"OECF",37377:"ShutterSpeedValue",37378:"ApertureValue",37379:"BrightnessValue",37380:"ExposureBias",37381:"MaxApertureValue",37382:"SubjectDistance",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37396:"SubjectArea",37386:"FocalLength",41483:"FlashEnergy",41484:"SpatialFrequencyResponse",41486:"FocalPlaneXResolution",41487:"FocalPlaneYResolution",41488:"FocalPlaneResolutionUnit",41492:"SubjectLocation",41493:"ExposureIndex",41495:"SensingMethod",41728:"FileSource",41729:"SceneType",41730:"CFAPattern",41985:"CustomRendered",41986:"ExposureMode",41987:"WhiteBalance",41988:"DigitalZoomRation",41989:"FocalLengthIn35mmFilm",41990:"SceneCaptureType",41991:"GainControl",41992:"Contrast",41993:"Saturation",41994:"Sharpness",41995:"DeviceSettingDescription",41996:"SubjectDistanceRange",40965:"InteroperabilityIFDPointer",42016:"ImageUniqueID"},v=m.TiffTags={256:"ImageWidth",257:"ImageHeight",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer",40965:"InteroperabilityIFDPointer",258:"BitsPerSample",259:"Compression",262:"PhotometricInterpretation",274:"Orientation",277:"SamplesPerPixel",284:"PlanarConfiguration",530:"YCbCrSubSampling",531:"YCbCrPositioning",282:"XResolution",283:"YResolution",296:"ResolutionUnit",273:"StripOffsets",278:"RowsPerStrip",279:"StripByteCounts",513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength",301:"TransferFunction",318:"WhitePoint",319:"PrimaryChromaticities",529:"YCbCrCoefficients",532:"ReferenceBlackWhite",306:"DateTime",270:"ImageDescription",271:"Make",272:"Model",305:"Software",315:"Artist",33432:"Copyright"},y=m.GPSTags={0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude",5:"GPSAltitudeRef",6:"GPSAltitude",7:"GPSTimeStamp",8:"GPSSatellites",9:"GPSStatus",10:"GPSMeasureMode",11:"GPSDOP",12:"GPSSpeedRef",13:"GPSSpeed",14:"GPSTrackRef",15:"GPSTrack",16:"GPSImgDirectionRef",17:"GPSImgDirection",18:"GPSMapDatum",19:"GPSDestLatitudeRef",20:"GPSDestLatitude",21:"GPSDestLongitudeRef",22:"GPSDestLongitude",23:"GPSDestBearingRef",24:"GPSDestBearing",25:"GPSDestDistanceRef",26:"GPSDestDistance",27:"GPSProcessingMethod",28:"GPSAreaInformation",29:"GPSDateStamp",30:"GPSDifferential"},b=m.StringValues={ExposureProgram:{0:"Not defined",1:"Manual",2:"Normal program",3:"Aperture priority",4:"Shutter priority",5:"Creative program",6:"Action program",7:"Portrait mode",8:"Landscape mode"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{0:"Unknown",1:"Daylight",2:"Fluorescent",3:"Tungsten (incandescent light)",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 - 5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},SensingMethod:{1:"Not defined",2:"One-chip color area sensor",3:"Two-chip color area sensor",4:"Three-chip color area sensor",5:"Color sequential area sensor",7:"Trilinear sensor",8:"Color sequential linear sensor"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},SceneType:{1:"Directly photographed"},CustomRendered:{0:"Normal process",1:"Custom process"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},GainControl:{0:"None",1:"Low gain up",2:"High gain up",3:"Low gain down",4:"High gain down"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},SubjectDistanceRange:{0:"Unknown",1:"Macro",2:"Close view",3:"Distant view"},FileSource:{3:"DSC"},Components:{0:"",1:"Y",2:"Cb",3:"Cr",4:"R",5:"G",6:"B"}},S={120:"caption",110:"credit",25:"keywords",55:"dateCreated",80:"byline",85:"bylineTitle",122:"captionWriter",105:"headline",116:"copyright",15:"category"};m.getData=function(e,t){return(e instanceof Image||e instanceof HTMLImageElement)&&!e.complete?!1:(n(e)?t&&t.call(e):s(e,t),!0)},m.getTag=function(e,t){return n(e)?e.exifdata[t]:void 0},m.getAllTags=function(e){if(!n(e))return{};var t,r=e.exifdata,i={};for(t in r)r.hasOwnProperty(t)&&(i[t]=r[t]);return i},m.pretty=function(e){if(!n(e))return"";var t,r=e.exifdata,i="";for(t in r)r.hasOwnProperty(t)&&(i+="object"==typeof r[t]?r[t]instanceof Number?t+" : "+r[t]+" ["+r[t].numerator+"/"+r[t].denominator+"]\r\n":t+" : ["+r[t].length+" values]\r\n":t+" : "+r[t]+"\r\n");return i},m.readFromBinaryFile=function(e){return u(e)},r=[],i=function(){return m}.apply(t,r),!(void 0!==i&&(e.exports=i))}).call(this)},function(e,t,n){var r,i;!function(){function n(e){var t=e.naturalWidth,n=e.naturalHeight;if(t*n>1048576){var r=document.createElement("canvas");r.width=r.height=1;var i=r.getContext("2d");return i.drawImage(e,-t+1,0),0===i.getImageData(0,0,1,1).data[3]}return!1}function o(e,t,n){var r=document.createElement("canvas");r.width=1,r.height=n;var i=r.getContext("2d");i.drawImage(e,0,0);for(var o=i.getImageData(0,0,1,n).data,a=0,s=n,u=n;u>a;){var c=o[4*(u-1)+3];0===c?s=u:a=u,u=s+a>>1}var l=u/n;return 0===l?1:l}function a(e,t,n){var r=document.createElement("canvas");return s(e,r,t,n),r.toDataURL("image/jpeg",t.quality||.8)}function s(e,t,r,i){var a=e.naturalWidth,s=e.naturalHeight,c=r.width,l=r.height,f=t.getContext("2d");f.save(),u(t,f,c,l,r.orientation);var d=n(e);d&&(a/=2,s/=2);var h=1024,g=document.createElement("canvas");g.width=g.height=h;for(var p=g.getContext("2d"),m=i?o(e,a,s):1,w=Math.ceil(h*c/a),v=Math.ceil(h*l/s/m),y=0,b=0;s>y;){for(var S=0,I=0;a>S;)p.clearRect(0,0,h,h),p.drawImage(e,-S,-y),f.drawImage(g,0,0,h,h,I,b,w,v),S+=h,I+=w;y+=h,b+=v}f.restore(),g=p=null}function u(e,t,n,r,i){switch(i){case 5:case 6:case 7:case 8:e.width=r,e.height=n;break;default:e.width=n,e.height=r}switch(i){case 2:t.translate(n,0),t.scale(-1,1);break;case 3:t.translate(n,r),t.rotate(Math.PI);break;case 4:t.translate(0,r),t.scale(1,-1);break;case 5:t.rotate(.5*Math.PI),t.scale(1,-1);break;case 6:t.rotate(.5*Math.PI),t.translate(0,-r);break;case 7:t.rotate(.5*Math.PI),t.translate(n,-r),t.scale(-1,1);break;case 8:t.rotate(-.5*Math.PI),t.translate(-n,0)}}function c(e){if(window.Blob&&e instanceof Blob){var t=new Image,n=window.URL&&window.URL.createObjectURL?window.URL:window.webkitURL&&window.webkitURL.createObjectURL?window.webkitURL:null;if(!n)throw Error("No createObjectURL function found to create blob url");t.src=n.createObjectURL(e),this.blob=e,e=t}if(!e.naturalWidth&&!e.naturalHeight){var r=this;e.onload=function(){var e=r.imageLoadListeners;if(e){r.imageLoadListeners=null;for(var t=0,n=e.length;n>t;t++)e[t]()}},this.imageLoadListeners=[]}this.srcImage=e}c.prototype.render=function(e,t,n){if(this.imageLoadListeners){var r=this;return void this.imageLoadListeners.push(function(){r.render(e,t,n)})}t=t||{};var i=this.srcImage,o=i.src,u=o.length,c=i.naturalWidth,l=i.naturalHeight,f=t.width,d=t.height,h=t.maxWidth,g=t.maxHeight,p=this.blob&&"image/jpeg"===this.blob.type||0===o.indexOf("data:image/jpeg")||o.indexOf(".jpg")===u-4||o.indexOf(".jpeg")===u-5;f&&!d?d=l*f/c<<0:d&&!f?f=c*d/l<<0:(f=c,d=l),h&&f>h&&(f=h,d=l*f/c<<0),g&&d>g&&(d=g,f=c*d/l<<0);var m={width:f,height:d};for(var w in t)m[w]=t[w];var v=e.tagName.toLowerCase();"img"===v?e.src=a(this.srcImage,m,p):"canvas"===v&&s(this.srcImage,e,m,p),"function"==typeof this.onrender&&this.onrender(e),n&&n()},r=[],i=function(){return c}.apply(t,r),!(void 0!==i&&(e.exports=i))}()},function(e,t){function n(e){function t(e){for(var t=[16,11,10,16,24,40,51,61,12,12,14,19,26,58,60,55,14,13,16,24,40,57,69,56,14,17,22,29,51,87,80,62,18,22,37,56,68,109,103,77,24,35,55,64,81,104,113,92,49,64,78,87,103,121,120,101,72,92,95,98,112,100,103,99],n=0;64>n;n++){var r=F((t[n]*e+50)/100);1>r?r=1:r>255&&(r=255),D[N[n]]=r}for(var i=[17,18,24,47,99,99,99,99,18,21,26,66,99,99,99,99,24,26,56,99,99,99,99,99,47,66,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99],o=0;64>o;o++){var a=F((i[o]*e+50)/100);1>a?a=1:a>255&&(a=255),x[N[o]]=a}for(var s=[1,1.387039845,1.306562965,1.175875602,1,.785694958,.5411961,.275899379],u=0,c=0;8>c;c++)for(var l=0;8>l;l++)U[u]=1/(D[N[u]]*s[c]*s[l]*8),C[u]=1/(x[N[u]]*s[c]*s[l]*8),u++}function n(e,t){for(var n=0,r=0,i=new Array,o=1;16>=o;o++){for(var a=1;a<=e[o];a++)i[t[r]]=[],i[t[r]][0]=n,i[t[r]][1]=o,r++,n++;n*=2}return i}function r(){y=n(W,H),b=n(V,X),S=n(z,q),I=n(Q,Y)}function i(){for(var e=1,t=2,n=1;15>=n;n++){for(var r=e;t>r;r++)A[32767+r]=n,T[32767+r]=[],T[32767+r][1]=n,T[32767+r][0]=r;for(var i=-(t-1);-e>=i;i++)A[32767+i]=n,T[32767+i]=[],T[32767+i][1]=n,T[32767+i][0]=t-1+i;e<<=1,t<<=1}}function o(){for(var e=0;256>e;e++)k[e]=19595*e,k[e+256>>0]=38470*e,k[e+512>>0]=7471*e+32768,k[e+768>>0]=-11059*e,k[e+1024>>0]=-21709*e,k[e+1280>>0]=32768*e+8421375,k[e+1536>>0]=-27439*e,k[e+1792>>0]=-5329*e}function a(e){for(var t=e[0],n=e[1]-1;n>=0;)t&1<<n&&(G|=1<<O),n--,O--,0>O&&(255==G?(s(255),s(0)):s(G),O=7,G=0)}function s(e){M.push(j[e])}function u(e){s(e>>8&255),s(255&e)}function c(e,t){var n,r,i,o,a,s,u,c,l,f=0;const d=8,h=64;for(l=0;d>l;++l){n=e[f],r=e[f+1],i=e[f+2],o=e[f+3],a=e[f+4],s=e[f+5],u=e[f+6],c=e[f+7];var g=n+c,p=n-c,m=r+u,w=r-u,v=i+s,y=i-s,b=o+a,S=o-a,I=g+b,P=g-b,F=m+v,D=m-v;e[f]=I+F,e[f+4]=I-F;var x=.707106781*(D+P);e[f+2]=P+x,e[f+6]=P-x,I=S+y,F=y+w,D=w+p;var U=.382683433*(I-D),C=.5411961*I+U,T=1.306562965*D+U,A=.707106781*F,R=p+A,M=p-A;e[f+5]=M+C,e[f+3]=M-C,e[f+1]=R+T,e[f+7]=R-T,f+=8}for(f=0,l=0;d>l;++l){n=e[f],r=e[f+8],i=e[f+16],o=e[f+24],a=e[f+32],s=e[f+40],u=e[f+48],c=e[f+56];var G=n+c,O=n-c,_=r+u,B=r-u,E=i+s,j=i-s,k=o+a,N=o-a,W=G+k,H=G-k,z=_+E,q=_-E;e[f]=W+z,e[f+32]=W-z;var V=.707106781*(q+H);e[f+16]=H+V,e[f+48]=H-V,W=N+j,z=j+B,q=B+O;var X=.382683433*(W-q),Q=.5411961*W+X,Y=1.306562965*q+X,K=.707106781*z,J=O+K,Z=O-K;e[f+40]=Z+Q,e[f+24]=Z-Q,e[f+8]=J+Y,e[f+56]=J-Y,f++}var $;for(l=0;h>l;++l)$=e[l]*t[l],L[l]=$>0?$+.5|0:$-.5|0;return L}function l(){u(65504),u(16),s(74),s(70),s(73),s(70),s(0),s(1),s(1),s(0),u(1),u(1),s(0),s(0)}function f(e,t){u(65472),u(17),s(8),u(t),u(e),s(3),s(1),s(17),s(0),s(2),s(17),s(1),s(3),s(17),s(1)}function d(){u(65499),u(132),s(0);for(var e=0;64>e;e++)s(D[e]);s(1);for(var t=0;64>t;t++)s(x[t])}function h(){u(65476),u(418),s(0);for(var e=0;16>e;e++)s(W[e+1]);for(var t=0;11>=t;t++)s(H[t]);s(16);for(var n=0;16>n;n++)s(z[n+1]);for(var r=0;161>=r;r++)s(q[r]);s(1);for(var i=0;16>i;i++)s(V[i+1]);for(var o=0;11>=o;o++)s(X[o]);s(17);for(var a=0;16>a;a++)s(Q[a+1]);for(var c=0;161>=c;c++)s(Y[c])}function g(){u(65498),u(12),s(3),s(1),s(0),s(2),s(17),s(3),s(17),s(0),s(63),s(0)}function p(e,t,n,r,i){var o,s=i[0],u=i[240];const l=16,f=63,d=64;for(var h=c(e,t),g=0;d>g;++g)R[N[g]]=h[g];var p=R[0]-n;n=R[0],0==p?a(r[0]):(o=32767+p,a(r[A[o]]),a(T[o]));for(var m=63;m>0&&0==R[m];m--);if(0==m)return a(s),n;for(var w,v=1;m>=v;){for(var y=v;0==R[v]&&m>=v;++v);var b=v-y;if(b>=l){w=b>>4;for(var S=1;w>=S;++S)a(u);b=15&b}o=32767+R[v],a(i[(b<<4)+A[o]]),a(T[o]),v++}return m!=f&&a(s),n}function m(){for(var e=String.fromCharCode,t=0;256>t;t++)j[t]=e(t)}function w(e){if(0>=e&&(e=1),e>100&&(e=100),P!=e){var n=0;n=50>e?Math.floor(5e3/e):Math.floor(200-2*e),t(n),P=e}}function v(){var t=(new Date).getTime();e||(e=50),m(),r(),i(),o(),w(e);(new Date).getTime()-t}var y,b,S,I,P,F=(Math.round,Math.floor),D=new Array(64),x=new Array(64),U=new Array(64),C=new Array(64),T=new Array(65535),A=new Array(65535),L=new Array(64),R=new Array(64),M=[],G=0,O=7,_=new Array(64),B=new Array(64),E=new Array(64),j=new Array(256),k=new Array(2048),N=[0,1,5,6,14,15,27,28,2,4,7,13,16,26,29,42,3,8,12,17,25,30,41,43,9,11,18,24,31,40,44,53,10,19,23,32,39,45,52,54,20,22,33,38,46,51,55,60,21,34,37,47,50,56,59,61,35,36,48,49,57,58,62,63],W=[0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0],H=[0,1,2,3,4,5,6,7,8,9,10,11],z=[0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,125],q=[1,2,3,0,4,17,5,18,33,49,65,6,19,81,97,7,34,113,20,50,129,145,161,8,35,66,177,193,21,82,209,240,36,51,98,114,130,9,10,22,23,24,25,26,37,38,39,40,41,42,52,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,225,226,227,228,229,230,231,232,233,234,241,242,243,244,245,246,247,248,249,250],V=[0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0],X=[0,1,2,3,4,5,6,7,8,9,10,11],Q=[0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,119],Y=[0,1,2,3,17,4,5,33,49,6,18,65,81,7,97,113,19,34,50,129,8,20,66,145,161,177,193,9,35,51,82,240,21,98,114,209,10,22,36,52,225,37,241,23,24,25,26,38,39,40,41,42,53,54,55,56,57,58,67,68,69,70,71,72,73,74,83,84,85,86,87,88,89,90,99,100,101,102,103,104,105,106,115,116,117,118,119,120,121,122,130,131,132,133,134,135,136,137,138,146,147,148,149,150,151,152,153,154,162,163,164,165,166,167,168,169,170,178,179,180,181,182,183,184,185,186,194,195,196,197,198,199,200,201,202,210,211,212,213,214,215,216,217,218,226,227,228,229,230,231,232,233,234,242,243,244,245,246,247,248,249,250];this.encode=function(e,t,n){var r=(new Date).getTime();t&&w(t),M=new Array,G=0,O=7,u(65496),l(),d(),f(e.width,e.height),h(),g();var i=0,o=0,s=0;G=0,O=7,this.encode.displayName="_encode_";for(var c,m,v,P,F,D,x,T,A,L=e.data,R=e.width,j=e.height,N=4*R,W=0;j>W;){for(c=0;N>c;){for(F=N*W+c,D=F,x=-1,T=0,A=0;64>A;A++)T=A>>3,x=4*(7&A),D=F+T*N+x,W+T>=j&&(D-=N*(W+1+T-j)),c+x>=N&&(D-=c+x-N+4),m=L[D++],v=L[D++],P=L[D++],_[A]=(k[m]+k[v+256>>0]+k[P+512>>0]>>16)-128,B[A]=(k[m+768>>0]+k[v+1024>>0]+k[P+1280>>0]>>16)-128,E[A]=(k[m+1280>>0]+k[v+1536>>0]+k[P+1792>>0]>>16)-128;i=p(_,U,i,y,S),o=p(B,C,o,b,I),s=p(E,C,s,b,I),c+=32}W+=8}if(O>=0){var H=[];H[1]=O+1,H[0]=(1<<O+1)-1,a(H)}if(u(65497),n){for(var z=M.length,q=new Uint8Array(z),V=0;z>V;V++)q[V]=M[V].charCodeAt();M=[];(new Date).getTime()-r;return q}var X="data:image/jpeg;base64,"+btoa(M.join(""));M=[];(new Date).getTime()-r;return X},v()}e.exports=n},function(e,t,n){function r(e,t){var n=this;if(!e)throw new Error("没有收到图片，可能的解决方案：https://github.com/think2011/localResizeIMG/issues/7");t=t||{},n.defaults={width:null,height:null,fieldName:"file",quality:.7},n.file=e;for(var r in t)t.hasOwnProperty(r)&&(n.defaults[r]=t[r]);return this.init()}function i(e){var t=null;return t=e?[].filter.call(document.scripts,function(t){return-1!==t.src.indexOf(e)})[0]:document.scripts[document.scripts.length-1],t?t.src.substr(0,t.src.lastIndexOf("/")):null}function o(e){var t;t=e.split(",")[0].indexOf("base64")>=0?atob(e.split(",")[1]):unescape(e.split(",")[1]);for(var n=e.split(",")[0].split(":")[1].split(";")[0],r=new Uint8Array(t.length),i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return new s.Blob([r.buffer],{type:n})}n.p=i("lrz")+"/",window.URL=window.URL||window.webkitURL;var a=n(1),s=n(4),u=n(5),c=function(e){var t=/OS (\d)_.* like Mac OS X/g.exec(e),n=/Android (\d.*?);/g.exec(e)||/Android\/(\d.*?) /g.exec(e);return{oldIOS:t?+t.pop()<8:!1,oldAndroid:n?+n.pop().substr(0,3)<4.5:!1,iOS:/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(e),android:/Android/g.test(e),mQQBrowser:/MQQBrowser/g.test(e)}}(navigator.userAgent);r.prototype.init=function(){var e=this,t=e.file,n="string"==typeof t,r=/^data:/.test(t),i=new Image,u=document.createElement("canvas"),c=n?t:URL.createObjectURL(t);if(e.img=i,e.blob=c,e.canvas=u,n?e.fileName=r?"base64.jpg":t.split("/").pop():e.fileName=t.name,!document.createElement("canvas").getContext)throw new Error("浏览器不支持canvas");return new a(function(n,a){i.onerror=function(){var e=new Error("加载图片文件失败");throw a(e),e},i.onload=function(){e._getBase64().then(function(e){if(e.length<10){var t=new Error("生成base64失败");throw a(t),t}return e}).then(function(r){var i=null;"object"==typeof e.file&&r.length>e.file.size?(i=new FormData,t=e.file):(i=new s.FormData,t=o(r)),i.append(e.defaults.fieldName,t,e.fileName.replace(/\..+/g,".jpg")),n({formData:i,fileLen:+t.size,base64:r,base64Len:r.length,origin:e.file,file:t});for(var a in e)e.hasOwnProperty(a)&&(e[a]=null);URL.revokeObjectURL(e.blob)})},!r&&(i.crossOrigin="*"),i.src=c})},r.prototype._getBase64=function(){var e=this,t=e.img,n=e.file,r=e.canvas;return new a(function(i){try{u.getData("object"==typeof n?n:t,function(){e.orientation=u.getTag(this,"Orientation"),e.resize=e._getResize(),e.ctx=r.getContext("2d"),r.width=e.resize.width,r.height=e.resize.height,e.ctx.fillStyle="#fff",e.ctx.fillRect(0,0,r.width,r.height),c.oldIOS?e._createBase64ForOldIOS().then(i):e._createBase64().then(i)})}catch(o){throw new Error(o)}})},r.prototype._createBase64ForOldIOS=function(){var e=this,t=e.img,r=e.canvas,i=e.defaults,o=e.orientation;return new a(function(e){!function(){var a=[n(6)];(function(n){var a=new n(t);"5678".indexOf(o)>-1?a.render(r,{width:r.height,height:r.width,orientation:o}):a.render(r,{width:r.width,height:r.height,orientation:o}),e(r.toDataURL("image/jpeg",i.quality))}).apply(null,a)}()})},r.prototype._createBase64=function(){var e=this,t=e.resize,r=e.img,i=e.canvas,o=e.ctx,s=e.defaults,u=e.orientation;switch(u){case 3:o.rotate(180*Math.PI/180),o.drawImage(r,-t.width,-t.height,t.width,t.height);break;case 6:o.rotate(90*Math.PI/180),o.drawImage(r,0,-t.width,t.height,t.width);break;case 8:o.rotate(270*Math.PI/180),o.drawImage(r,-t.height,0,t.height,t.width);break;case 2:o.translate(t.width,0),o.scale(-1,1),o.drawImage(r,0,0,t.width,t.height);break;case 4:o.translate(t.width,0),o.scale(-1,1),o.rotate(180*Math.PI/180),o.drawImage(r,-t.width,-t.height,t.width,t.height);break;case 5:o.translate(t.width,0),o.scale(-1,1),o.rotate(90*Math.PI/180),o.drawImage(r,0,-t.width,t.height,t.width);break;case 7:o.translate(t.width,0),o.scale(-1,1),o.rotate(270*Math.PI/180),o.drawImage(r,-t.height,0,t.height,t.width);break;default:o.drawImage(r,0,0,t.width,t.height)}return new a(function(e){c.oldAndroid||c.mQQBrowser||!navigator.userAgent?!function(){var t=[n(7)];(function(t){var n=new t,r=o.getImageData(0,0,i.width,i.height);e(n.encode(r,100*s.quality))}).apply(null,t)}():e(i.toDataURL("image/jpeg",s.quality))})},r.prototype._getResize=function(){var e=this,t=e.img,n=e.defaults,r=n.width,i=n.height,o=e.orientation,a={width:t.width,height:t.height};if("5678".indexOf(o)>-1&&(a.width=t.height,a.height=t.width),a.width<r||a.height<i)return a;var s=a.width/a.height;for(r&&i?s>=r/i?a.width>r&&(a.width=r,a.height=Math.ceil(r/s)):a.height>i&&(a.height=i,a.width=Math.ceil(i*s)):r?r<a.width&&(a.width=r,a.height=Math.ceil(r/s)):i&&i<a.height&&(a.width=Math.ceil(i*s),a.height=i);a.width>=3264||a.height>=2448;)a.width*=.8,a.height*=.8;return a},window.lrz=function(e,t){return new r(e,t)},window.lrz.version="4.9.40",e.exports=window.lrz}])});





(function() {
    //时间格式化
    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    };
    var Request = (function () {
        var url = decodeURI(location.search); //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].substr(strs[i].indexOf("=")+1));
            }
        }
        return theRequest;
    })();
    if(Request["apiparams"]||Request["params"]||Request["dp"]){
        var str="",key="";
        if(Request["apiparams"]){
            str=Request["apiparams"];
            key="4c43a8be"+"-85b6-4563-a322"+"-44db9caf8454";
        }else if(Request["params"]){
            str=Request["params"];
            key="4c43a8be"+"-85b6-4563-a322"+"-44db9caf8454";
        }else if(Request["dp"]){
            str=Request["dp"];
            key="ud_yhy_demo_text";
        }
        var decryptedData = CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
        Request = (function () {
            var strs = decryptedData.split("&");
            var theRequest = new Object();
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
            if(Request["apiparams"]){
                theRequest["is_api"]="1";
            }
            return theRequest;
        })();
    }

    //主函数
    var h5_upload = {
/********** 商户信息 **********/
        reTestTime:3,//24小时重试次数
        pub_key: Request["pub_key"]||"", //公钥，与sign中使用的一致
        sign_time: Request["sign_time"]||(new Date()).format('yyyyMMddhhmmss'), //格式yyyyMMddhhmmss，与sign中使用的一致
        sign: Request["sign"]||"", //签名
        step_num: Request["step_num"], //第几步，可用于查看按钮背景色改变后效果（1：身份证正反面页面，2：修改姓名页面，3：上传视频页面，4：结果页面）
        url_type: Request["url_type"]||"zs", //商户订单号，测试时默认cs，上线时默认zs（cs：测试，zs：正式，zs-a：正式a，zs-b：正式b）
        partner_order_id: Request["partner_order_id"]||(+new Date()), //商户订单号  测试时默认时间戳,与签名中一致
        // package_code: Request["package_code"]||"TC010", //套餐代码
        extension_info: Request["extension_info"]||"", //扩展信息
        btn_color:Request["btn_color"]||"#12addd", //按钮颜色，格式为url('。。。') 或 #333 或 red
        finally_color:Request["finally_color"]||"url('./images/blueback.png')", //结果页背景颜色，格式为url('。。。') 或 #333 或 red
        callback_url:Request["callback_url"]||"", //回调商户url
        id_name:Request["id_name"]||"", //身份证姓名
        id_number:Request["id_number"]||"", //身份证号码
        is_api:Request["is_api"]||"", //是否上传图片
        // threshold_level:Request["threshold_level"]||"1", //阈值等级
        return_url:Request["return_url"]||"", //回显页面

/********** 常量 **********/
        time2wait : 600*1000,//转圈等待时间
        maxvideosize: 5,//最多视频大小，单位兆
        nowPiczorf:1,//目前要排的是正面还是反面
        saveHuotiNum:"ud_htnum",//调用次数记录
        saveHuotiTime:"ud_httime",//调用时间
        saveHuotiName:"ud_htname",//已认证
        timeoutTime:20*1000,
        userAgent:navigator.userAgent,

/********** 缓存数据 **********/
        minPic: {
            1: "",
            2: ""
        }, //保存压缩后的照片
        minVid:"", //保存压缩后的视频
        savePostPic1: {}, //保存正面照上传结果，防止重复提交
        savePostPic2: {}, //保存反面照上传结果
        saveInfo: {
            name: "",
            card: "",
            time: "",
            cardshow:""
        }, //保存正反面照需要信息
        return_photo: "",//优图返回图片
        session_id: "", //套餐会话ID


        //初始化
        init: function() {
            var that = this;
            AV.init({
                appId: 'BcjvMsRSFqPvuxCRbUmhwOtU-gzGzoHsz',
                appKey: 'rQV77q18DvrAp5oPClWJESP7'
            });
            if(location.host!="static.udcredit.com"){
                that.reTestTime=50;
            }
            that.sign_time_date=new Date(that.sign_time.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1/$2/$3 $4:$5:$6'));
            if(that.id_name&&that.id_number){
                that.jianban=true;
            }
            that.apiConfig = that.apiConfig();
            that.ErrorTip = that.ErrorTip();

            that.eventBind();
            if(that.step_num){
                that.showStep(that.step_num);
            }else if(that.id_name&&that.id_number){
                if(that.is_api){
                    that.showStep(6);
                    $("#agreement3").show();
                }else{
                    that.postGetValidate();
                    $("#agreement2").show();
                }
            }else{
                that.showStep(1);
            }
            setTimeout(function(){
                that.initColor();
            },1)
            // that.takePhoto();
            window.onerror = function (errMsg, scriptURI, lineNumber, columnNumber, errorObj) {
                setTimeout(function () {
                    var rst = {
                        "错误信息：": errMsg,
                        "出错文件：": scriptURI,
                        "出错行号：": lineNumber,
                        "出错列号：": columnNumber,
                        "错误详情：": errorObj
                    };
                    if(location.host!="static.udcredit.com"){
                        alert(JSON.stringify(rst));
                    }
                    that.ErrorTip.show("网络异常，请稍后再试",that.time2wait);
                    // setTimeout(function(){
                    //     location.reload();
                    // },2000);
                });
                return false;
            };
        },
        save : function(name,id,obj){
            var todo ;
            if(id){
                todo = AV.Object.createWithoutData(name, id);
            }else{
                var Todo = AV.Object.extend(name)
                todo = new Todo();
            }
            for(var i in obj){
                todo.set(i, obj[i]);
            }
            return todo.save();
        },
        //渲染颜色
        initColor: function () {
            var that = this;
            $("#step5").css({"background":that.finally_color,"background-size":"100% 100%"});
            $(".submit-btn").css({"background":that.btn_color,"background-size":"100% 100%"});
            if(that.isPC()){
                $("html").addClass("pc");
                $("#upload1,#upload2,#upload6").attr("accept","image/png,image/jpg,image/jpeg")
            }
            $("html").show();
        },
        //判断是否需要适配pc
        isPC:function(){
            var that=this;
            var userAgent = that.userAgent.toLowerCase();
            if(userAgent.indexOf("windows phone") >= 0){
                return  false;
            } else if(userAgent.indexOf("symbianos") >= 0){
                return false;
            } else if(userAgent.indexOf("android") >= 0){
                return false;
            } else if(userAgent.indexOf("iphone") >= 0 || userAgent.indexOf("ipad") >= 0 || userAgent.indexOf("iPod") >= 0 || userAgent.indexOf("ios") >= 0){
                return false;
            } else{
                return true;
            }
        },
        //拍照
        takePhoto: function(){
            var that = this;
            var videoObj={'video': true};
            //获取要控制的DOM对象
            var canvas=document.getElementById('canvas_show'),//createElement
                context=canvas.getContext('2d'),
                video=document.getElementById('video_show'),
                errBack=function(error){
                    console.log('video capture error:',error.code);
                };
            navigator.myGetUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;
            navigator.myGetUserMedia(videoObj,function(localMediaStream){
                window.URL=window.URL||window.webkitURL||window.mozURL||window.msURL;
                video.src=window.URL.createObjectURL(localMediaStream);
                video.play();
            },errBack);
            video.onloadedmetadata=function(e){
                window.setInterval(function(){
                    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                },15);
                $('#snap_in').click(function(){
                    that.showStep(1);
                    // context.drawImage(video,0,0,video.videoWidth, video.videoHeight);
                    that.minPic[that.nowPiczorf] = canvas.toDataURL('image/jpeg', 1);
                    $(".uploadpic"+that.nowPiczorf).attr("src",that.minPic[that.nowPiczorf]);
                })
            };
        },
        clearInputFile: function(index){
            var that = this;
            var file=$("#upload"+index);
            file.after(file.clone().val(""));
            file.remove();
            that.eventBindPic(index);
        },
        //绑定按键
        eventBind: function() {
            var that = this;
            that.eventBindPic(1);
            that.eventBindPic(2);
            that.eventBindPic(6);
            that.eventBindPic(4);
            $("#submit1").bind("click",function() {
                that.upload1();
            });
            $("#submit2").bind("click",function() {
                that.upload2();
            });
            $("#submit3").bind("click",function() {
                that.upload3();
            });
            $("#submit4").bind("click",function() {
                that.upload4();
            });
            $("#cname_edit").bind("click",function() {
                $("#cname").focus();
            });
            $("#submit5").bind("click",function() {
                that.closeWindow();
            });
            $("#submit6").bind("click",function() {
                that.upload6();
            });
        },
        closeWindow: function(){
            var that=this;
            try{
                var ua = that.userAgent.toLowerCase();
                if(ua.match(/MicroMessenger/i)=="micromessenger") {
                    WeixinJSBridge.call('closeWindow');
                } else if(ua.indexOf("alipay")!=-1){
                    AlipayJSBridge.call('closeWebview');
                }else if(ua.indexOf("baidu")!=-1){
                    BLightApp.closeWindow();
                }
            }catch(e){}
            window.opener = null;
            window.open("about:blank", "_self");
            window.close();
            window.history.go(-1)
        },
        showLog:function(str){
            $("#log").html(str+"<br>"+$("#log").html());
        },
        //绑定改变图片事件事件
        eventBindPic: function(index) {
            var that = this;
            if(index==4){
                $("#upload"+index).bind("click",function(event) {
                    if($("#agreement2").css("display")!="none"&&$("#isagreement2:checked").length==0){
                        that.ErrorTip.show("请您先阅读并勾选<br>《用户协议》");
                        event.preventDefault();
                    }
                });
                $("#upload"+index).bind("change",function() {
                    if(this.files.length&&this.files[0]){
                        that.ErrorTip.show("加载中",that.time2wait);
                    }else{
                        that.ErrorTip.show("请选择视频");
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        that.compressv(this.result,e);
                    };
                    reader.readAsDataURL(this.files[0]);
                });
            }else{
                $("#upload"+index).bind("click",function(event) {
                    that.checkTime.step(0,+new Date());
                });
                $("#upload"+index).bind("change",function(event) {
                    var that2=this;
                    if(that2.files&&that2.files.length&&that2.files[0]){
                        that.ErrorTip.show("加载中",that.time2wait);
                    }else{
                        that.ErrorTip.show("请选择图片");
                        return;
                    }
                    var file=that2.files[0];
                    if(!that.checkTime.step(1,+file.lastModified)){
                        that.ErrorTip.show("拍摄过快，请稍等几秒再进行拍摄",4000);
                        that.clearInputFile(index);
                        return
                    }

                    that.checkTime.step(2,+new Date());
                    lrz(file, {width: 800}).then(function (rst) {
                        that.save("deveceInfo","",{
                            exif:JSON.stringify(rst.origin.exifdata),
                            ua:that.userAgent,
                            words:JSON.stringify({timeList:that.timeList})
                        });
                        var mes=that.checkTime.get(rst);
                        $("#showEnd").html(mes||"有效拍摄照片");


                        that.compress(rst.base64, index);
                    });
                });
            }
        },
         //验证
        checkTime: new (function () {
            var ua = navigator.userAgent.toLowerCase();
            this._timeLine=[];
            this._timeLineOld=[];
            this.showLog=function(str){
                $("#log").html(str+"<br>"+$("#log").html());
            },
            this.step = function(index,value){
                this._timeLine[index]=value;
                if(index==1&&this._timeLineOld[index]==this._timeLine[index]&&ua.indexOf("ucbrowser")>-1&&ua.indexOf("android")>-1){
                    return false;//安卓uc连拍会报错
                }
                return true;
            }
            this.isAndroidUc=function () {
                return ua.indexOf("ucbrowser")>-1&&ua.indexOf("android")>-1;
            }

            this.get = function(rst){
                var _timeLine=this._timeLine,
                    retmsg="";
                    iphoneList=["Orientation","ColorSpace","ExifIFDPointer","PixelXDimension","PixelYDimension"],
                    exifdataCount=(function () {
                        var _tmp=0;
                        for(var i in rst.origin.exifdata){
                            _tmp++;
                        }
                        return _tmp;
                    })();
                if(exifdataCount==0){//没有exif为非拍摄照片
                    retmsg= "exif为空";
                }else if(!rst.origin.exifdata.DateTimeDigitized||!rst.origin.exifdata.DateTimeOriginal||!rst.origin.lastModified){//iPhone没有拍摄时间
                    if(ua.indexOf("iphone os") >= 0){
                        if(exifdataCount==iphoneList.length){
                            for(var i in rst.origin.exifdata){
                                if(iphoneList.indexOf(i)==-1){
                                    retmsg= "iphone拍摄信息有误";
                                    break;
                                }
                            }
                        }else{
                            retmsg= "iphone拍摄信息有误";
                        }
                    }else{
                        retmsg= "exif无拍摄时间，且不是iphone";
                    }
                }else{
                    var timeList=[
                        +new Date(rst.origin.exifdata.DateTimeDigitized.replace(/\:(?=.+\s)/g,"/")),
                        +new Date(rst.origin.exifdata.DateTimeOriginal.replace(/\:(?=.+\s)/g,"/")),
                        +rst.origin.lastModified
                    ]
                    for(var i=1;i<timeList.length;i++){
                        if(timeList[i]&&timeList[i-1]){
                            if(Math.abs(timeList[i]-timeList[i-1])>10*1000){
                                retmsg= "拍摄照片时间被修改过";
                                break;
                            }
                        }
                    }
                }
                if(!retmsg){

                    if(this._timeLineOld[1]==this._timeLine[1]&&this.isAndroidUc()){
                      ;//安卓UC时间有时候会取到和上次一样
                    }else{
                      if(_timeLine[0]>=_timeLine[1]){
                          retmsg= "非实时拍摄照片(拍摄于较早时间)";
                      }else if(_timeLine[1]>=_timeLine[2]){
                          retmsg= "非实时拍摄照片(拍摄于较晚时间)";
                      }else if(_timeLine[2]-_timeLine[1]>10*1000){
                          retmsg= "疑似翻拍照片(图片处理时间过长)";
                      }
                    }
                }

                this._timeLineOld=this._timeLine.splice(0);
                return retmsg;
            };
        })(),
         //弹框
        ErrorTip: function () {
            var dom = "<div  id='ErrorTipModal' class='error_tip_frame'><div class='error_tip_inner'>{{message}}</div></div>";
            var obj, time;
            function hide() {
                if (obj) {
                    obj.remove();
                    obj = "";
                }
            };
            function show(message, wait) {
                hide();
                if (!message) {
                    return;
                }
                if(message.indexOf("签名过期")>=0){
                    message="操作超时，请重新认证";
                }

                obj = $(dom.replace("{{message}}", message)).appendTo("body");
                var waitTime=0;
                if(wait){
                    waitTime=wait;
                }else if(message.length/6>1){
                    waitTime=message.length*1000/(5+~~(message.length/6));
                }else{
                    waitTime=1000;
                }
                time = setTimeout(function() {
                    hide();
                }, waitTime);
            };
            return {
                show: show,
                hide: hide
            };
        },
        //环境
        apiConfig:function(){
            var that = this;
            var apiConfigMap={
                "cs":{url: "http://10.1.30.51:8000/idsafe-front/front/4.3/api/"},
                "zs":{url:"https://idsafe-auth.udcredit.com/front/4.3/api/"},
                "zs-a":{url:"https://idsafe-auth-a.udcredit.com/front/4.3/api/"},
                "zs-b":{url:"https://idsafe-auth-b.udcredit.com/front/4.3/api/"}
            };
            var retObj = apiConfigMap[that.url_type]?apiConfigMap[that.url_type]:apiConfigMap["zs"];
            if(that.pub_key){
                retObj.pub_key=that.pub_key;
                delete retObj.security_key;
            }
            return retObj;
        },
        //压缩图片
        compress: function(res, index) {
            var that = this,
                img = new Image();
            that.ErrorTip.show("加载中",that.time2wait);
            setTimeout(function(){
                img.src = res;
            },10);

            img.onload = function() {
                var cvs = document.createElement('canvas'),
                    ctx = cvs.getContext('2d'),
                    _offheight=0,
                    bili=0.8;
                cvs.width=img.width;
                cvs.height=img.height;

                // if(index!=6&&img.height>img.width*bili){
                //     _offheight=-(img.height-img.width*bili)/2;
                //     cvs.height = img.width*bili;
                // }
                ctx.drawImage(img, 0, _offheight, img.width, img.height);
                if(!that.isColorPhoto(ctx.getImageData(0, _offheight, img.width, img.height).data)){
                    if(index==6){
                        that.ErrorTip.show("请拍摄有效照片");
                    }else{
                        that.ErrorTip.show("请拍摄有效身份证件");
                    }
                    that.clearInputFile(index);
                    return;
                }
                that.minPic[index] = cvs.toDataURL('image/jpeg');
                $(".uploadpic"+index).attr("src",cvs.toDataURL('image/jpeg'));
                $(".uploadinfo" + index).hide();
                that.clearInputFile(index);
                setTimeout(function(){
                    that.ErrorTip.show("",1);
                },that.checkTime.isAndroidUc()?7*1000:1000);
             };
             img.onerror=function(){
                alert("onerror")
             }
        },
        //压缩视频
        compressv: function(res, e) {
            var that = this;
            if(e.total>that.maxvideosize*1024*1024){
                that.ErrorTip.show("当前视频"+(e.total/1024/1024).toFixed(2)+"MB，超过"+that.maxvideosize+"MB，请缩短拍摄时间或降低视频分辨率再上传");
                that.clearInputFile(4);
                return;
            }
            that.minVid = res;
            that.clearInputFile(4);
            that.upload4();
        },
        showStep:function(index) {
            $(".step").hide();
            $("#step"+index).show();
            if(index=="1"){
                $("title").html("添加身份证正面信息");
                $(".top-1,.top-2").show();
                $(".active").removeClass("active");
                $(".top-step1").addClass("active");
            }else if(index=="2"){
                $("title").html("添加身份证反面信息");
                $(".top-1,.top-2").show();
                $(".active").removeClass("active");
                $(".top-step1,.top-step2").addClass("active");
            }else if(index=="3"){
                $("title").html("确认信息");
                $(".top-1,.top-2").show();
                $(".active").removeClass("active");
                $(".top-step1,.top-step2,.top-step3").addClass("active");
            }else if(index=="4"){
                $("title").html("验证身份");
                $(".top-1,.top-2").hide();
            }else if(index=="5"){
                $("title").html("认证结果");
                $(".top-1,.top-2").hide();
            }else if(index=="6"){
                $("title").html("上传正面照");
                $(".top-1,.top-2").hide();
            }
        },
        //ajax错误
        ajaxErrorFn: function(that,xhr,textStatus) {
            if(textStatus=="timeout"){
                that.ErrorTip.show("网络超时，请稍后再试", 3000);
            }else{
                that.ErrorTip.show("网络异常，请稍后再试", 3000);
            }
        },
        //api:身份证正面OCR识别接口
        upload1: function() {
            var that = this;
            if($("#agreement1").css("display")!="none"&&$("#isagreement1:checked").length==0){
                that.ErrorTip.show("请您先阅读并勾选<br>《用户协议》");
                return;
            }
            if (!that.minPic[1]) {
                that.ErrorTip.show("请上传身份证正面图片");
                that.clearInputFile(1);
                return;
            }
            that.ErrorTip.show("正在验证，请稍候", that.time2wait);
            var postData = {
                "header": {
                    "session_id": "",
                    "partner_order_id": that.partner_order_id,
                    "sign": "",
                    "sign_time": that.sign_time
                },
                "body": {
                    "idcard_front_photo": that.minPic[1].substr(that.minPic[1].indexOf(",")+1,that.minPic[1].length-1)
                }
            }
            if (that.savePostPic1[postData.body.idcard_front_photo]) {
                successFn(that.savePostPic1[postData.body.idcard_front_photo]);
                return;
            }
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key);

            function successFn(data) {
                // {"birthday":"1989.04.01","partner_order_id":"0001","id_number":"350427198904010016","address":"福屯省二省方怀马3海科村门锐2号","gender":"男","nation":"汉","session_id":"150097098267099136","age":"27","id_name":"蒋景汉"}
                that.savePostPic1[postData.body.idcard_front_photo] = data;
                if (!data.result.success) {
                    that.ErrorTip.show((data.result.message || data.result.errorcode)+"<br>请点击证件图片重新拍摄");
                } else {
                    that.saveInfo.name = data.data.id_name;
                    that.saveInfo.card = data.data.id_number;
                    if(that.saveInfo.card.length>8){
                        that.saveInfo.cardshow=that.saveInfo.card.substr(0,4)
                            +"************************".substr(0,that.saveInfo.card.length-6)
                            +that.saveInfo.card.substr(that.saveInfo.card.length-2,2);
                    }else{
                        that.saveInfo.card = data.data.cardshow;
                    }
                    that.session_id = data.data.session_id;
                    that.ErrorTip.show("验证成功", 100);
                    that.showStep(2);
                }
                that.clearInputFile(1);
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "idcard_front_photo_ocr/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                timeout:that.timeoutTime,
                data: JSON.stringify(postData),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
            });
        },
        //api:身份证反面OCR识别接口
        upload2: function() {
            var that = this;
            if (!that.minPic[2]) {
                that.ErrorTip.show("请上传身份证反面图片");
                that.clearInputFile(2);
                return;
            }
            that.ErrorTip.show("正在验证，请稍候", that.time2wait);
            var postData = {
                "header": {
                    "session_id": that.session_id,
                    "partner_order_id": that.partner_order_id,
                    "sign": "",
                    "sign_time": that.sign_time
                },
                "body": {
                    idcard_back_photo: that.minPic[2].substr(that.minPic[2].indexOf(",")+1,that.minPic[2].length-1)
                }
            }
            if (that.savePostPic2[postData.body.idcard_back_photo]) {
                successFn(that.savePostPic2[postData.body.idcard_back_photo]);
                return;
            }
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                //{"partner_order_id":"0001","idcard_back_photo":"20170208141512763934468.jpg","issuing_authority":"宁盘中卫市公安局沙坡头区局","validity_period":"2007.11.28-长期","session_id":"150138789514641409"}
                that.savePostPic2[postData.body.idcard_back_photo] = data;
                if (!data.result.success) {
                    that.ErrorTip.show((data.result.message || data.result.errorcode)+"<br>请点击证件图片重新拍摄");
                } else {
                    that.saveInfo.time = data.data.validity_period;
                    that.session_id = data.data.session_id;
                    that.ErrorTip.show("验证成功", 100);
                    that.showStep(3);
                    $("#cname").val(that.saveInfo.name);
                    $("#ccard").text(that.saveInfo.cardshow);
                    $("#ctime").text(that.saveInfo.time);
                }
                that.clearInputFile(1);
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "idcard_back_photo_ocr/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                data: JSON.stringify(postData),
                timeout:that.timeoutTime,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
            });
        },
        //api:OCR识别结果更新接口，修改姓名提交
        upload3: function() {
            var that = this;
            var name=$.trim($("#cname").val());
            var namePattern = new RegExp("^([\u4e00-\u9fa5\u3400-\u4db5]+(·[\u4e00-\u9fa5\u3400-\u4db5]+)*)$");
            if(!that.session_id){
                that.ErrorTip.show("请按顺序进行验证");
            }else if (!name) {
                that.ErrorTip.show("请输入身份证姓名");
            }else if (name.length<2) {
                that.ErrorTip.show("姓名格式错误，请重新输入");
            }else if (!namePattern.test(name)) {
                that.ErrorTip.show("姓名格式错误，请重新输入");
            }else if (that.saveInfo.name == name) {
                if(that.is_api){
                    that.showStep(6);
                }else{
                    that.postGetValidate();
                }
            } else {
                that.ErrorTip.show("正在修改姓名，请稍候", that.time2wait);
                var postData = {
                    "header": {
                        "session_id": that.session_id,
                        "partner_order_id": that.partner_order_id,
                        "sign": "",
                        "sign_time": that.sign_time
                    },
                    "body": {
                        id_name: name
                    }
                }
                postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)

                function successFn(data) {
                    if (!data.result.success) {
                        that.ErrorTip.show(data.result.message || data.result.errorcode);
                    } else {
                        that.ErrorTip.show("姓名修改成功", 100);
                        that.session_id = data.data.session_id;
                        that.saveInfo.name = name;
                        if(that.is_api){
                            that.showStep(6);
                        }else{
                            that.postGetValidate();
                        }

                    }
                }
                $.ajax({
                    type: "POST",
                    url: that.apiConfig.url + "update_ocr_info/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                    timeout:that.timeoutTime,
                    data: JSON.stringify(postData),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: successFn,
                    error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
                });
            }
        },
        //api:获取活体检测唇语验证码接口
        postGetValidate: function() {
            var that = this;
            // that.ErrorTip.show("验证码获取中，请稍候", that.time2wait);
            var postData = {
                "header": {
                    "session_id": that.session_id,
                    "partner_order_id": that.partner_order_id,
                    "sign": "",
                    "sign_time": that.sign_time
                },
                "body": {
                }
            }
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                if (!data.result.success) {
                    that.ErrorTip.show(data.result.message || data.result.errorcode);
                } else {
                    that.ErrorTip.show("验证码获取成功", 100);
                    that.session_id = data.data.session_id;
                    $(".take-num").text(data.data.living_validate_data);
                    // if(that.getInfo(that.saveHuotiName)&&that.getInfo(that.saveHuotiName).split(",").indexOf(that.apiConfig.pub_key+"{{#}}"+that.saveInfo.card)>=0){
                    //     $("#upload4").hide();
                    // } else
                    if(that.getInfo(that.saveHuotiNum)>=that.reTestTime && new Date()-that.getInfo(that.saveHuotiTime)<24*60*60*1000){
                        $("#upload4").hide();
                    }
                    that.showStep(4);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "get_living_validate_data/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                data: JSON.stringify(postData),
                timeout:that.timeoutTime,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
            });
        },
        //api:活体检测接口
        upload4: function() {
            var that = this;
            if($("#agreement2").css("display")!="none"&&$("#isagreement2:checked").length==0){
                that.ErrorTip.show("请您先阅读并勾选<br>《用户协议》");
                return;
            }
            // if(!that.session_id){
            //     that.ErrorTip.show("请按顺序进行验证");
            // } else if(that.getInfo(that.saveHuotiName)&&that.getInfo(that.saveHuotiName).split(",").indexOf(that.apiConfig.pub_key+"{{#}}"+that.saveInfo.card)>=0){
            //     that.ErrorTip.show("已存在认证通过的记录，请勿重复认证");
            // } else
            if(that.getInfo(that.saveHuotiNum)>=that.reTestTime && new Date()-that.getInfo(that.saveHuotiTime)<24*60*60*1000){
                that.ErrorTip.show("人脸认证失败次数过多，请24小时后再尝试。");
            } else if(!that.minVid){
                that.ErrorTip.show("人脸认证失败次数过多，请24小时后再尝试。");
            }else{
                that.ErrorTip.show("人脸认证中，请稍候", that.time2wait);
                if(new Date()-that.getInfo(that.saveHuotiTime)>24*60*60*1000){
                    that.setInfo(that.saveHuotiNum,1);
                }else{
                    that.setInfo(that.saveHuotiNum,+(that.getInfo(that.saveHuotiNum)||0)+1);
                }
                that.setInfo(that.saveHuotiTime,+new Date());
                if(that.getInfo(that.saveHuotiNum)>=that.reTestTime){
                    $("#upload4").hide();
                }
                that.h5_check();
            }
        },
        //api:上传图片认证
        upload6: function() {
            var that = this;
            if($("#agreement3").css("display")!="none"&&$("#isagreement3:checked").length==0){
                that.ErrorTip.show("请您先阅读并勾选<br>《用户协议》");
                return;
            }

            if (!that.minPic[6]) {
                that.ErrorTip.show("请上传身份证正面图片");
                that.clearInputFile(6);
            }else{
                that.h5_check();
            }

        },
        //h5-api:身份验证接口
        h5_check: function() {
            var that = this;
            that.ErrorTip.show("处理中，请稍候", that.time2wait);
            var postData = {
                "header": {
                    "session_id": that.session_id,
                    "partner_order_id": that.partner_order_id,
                    "sign": "",
                    "sign_time": that.sign_time
                },
                "body": {
                    id_number:that.saveInfo.card||that.id_number,
                    id_name:that.saveInfo.name||that.id_name,
                    verify_type:1
                }
            }
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                // "500006", "查询不到身份信息"
                // "500007", "姓名和身份证号不一致"
                // "500014", "姓名和身份证号一致，查询不到照片"
                // 0-姓名与号码一致，但无网格照；
                // 1-姓名与号码一致；
                // 2-姓名与号码不一致；
                // 3-查询无结果；
                if (!data.result.success) {
                    that.setEndShow("F","0");
                    that.pushCallback("F","0",data.result.errorcode||"999999",data.result.message||"系统异常");
                    that.showStep(5);
                } else if(data.data.verify_status+""=="0"){
                    that.setEndShow("F","0");
                    that.pushCallback("F","0","500014","姓名和身份证号码一致，但查询不到照片");
                    that.showStep(5);
                } else if(data.data.verify_status+""=="2"){
                    that.setEndShow("F","0");
                    that.pushCallback("F","0","500007","姓名和身份证号码不一致");
                    that.showStep(5);
                } else if(data.data.verify_status+""=="3"){
                    that.setEndShow("F","0");
                    that.pushCallback("F","0","500006","姓名和身份证号查询无结果");
                    that.showStep(5);
                } else {
                    that.session_id = data.data.session_id;
                    if(that.is_api){
                        that.api_compare();
                    }else{
                        that.h5_verify();
                    }
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "idcard_verify/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                data: JSON.stringify(postData),
                timeout:that.timeoutTime,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
            });
        },
        //h5-api:活体检测接口
        h5_verify: function() {
            var that = this;
            that.ErrorTip.show("处理中，请稍候", that.time2wait);
            var postData = {
                    "header": {
                        "session_id": that.session_id,
                        "partner_order_id": that.partner_order_id,
                        "sign": "",
                        "sign_time": that.sign_time
                    },
                    "body": {
                        living_video: that.minVid.substr(that.minVid.indexOf(",")+1,that.minVid.length-1)
                    }
                }
                postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)

                function successFn(data) {
                    if (!data.result.success) {
                        that.setEndShow("F","0");
                        that.pushCallback("F","0",data.result.errorcode||"999999",data.result.message||"系统异常");
                        that.showStep(5);
                    } else {
                        that.session_id = data.data.session_id;
                        that.return_photo = data.data.living_photo;
                        if(data.data.risk_tag&&data.data.risk_tag.living_attack=="1"){
                            that.living_attack = "1";
                        }
                        that.h5_compare();
                    }
                }
                $.ajax({
                    type: "POST",
                    url: that.apiConfig.url + "living_detection/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                    data: JSON.stringify(postData),
                    timeout:that.timeoutTime*3,
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: successFn,
                    error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
                });
        },
        //h5-api:人脸比对组合接口
        h5_compare: function() {
            var that = this;
            that.ErrorTip.show("处理中，请稍候", that.time2wait);
            var postData = {
                "header": {
                    "session_id": that.session_id,
                    "partner_order_id": that.partner_order_id,
                    "sign": "",
                    "sign_time": that.sign_time
                },
                "body": {
                    "photo1": {
                        "img_file_source": "0",
                        "img_file_type": "1",
                        "img_file": that.session_id
                    },
                    "photo2": {
                        "img_file_source": "0",
                        "img_file_type": "3",
                        "img_file": that.session_id
                    }
                }
            }
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                // "500006", "查询不到身份信息"
                // "500007", "姓名和身份证号不一致"
                // "500014", "姓名和身份证号一致，查询不到照片"
                if (!data.result.success) {
                    // that.ErrorTip.show(data.result.message || data.result.errorcode,2000);
                    // setTimeout(function(){
                    //     that.postGetValidate();
                    // },2000);
                    that.setEndShow("F","0");
                    that.pushCallback("F","0",data.result.errorcode||"999999",data.result.message||"系统异常");
                    that.showStep(5);
                } else {
                    that.ErrorTip.show("验证完成",100);
                    if(!data.data){
                        data.data={};
                    }
                    if(data.data.similarity>data.data.thresholds["1e-3"]){
                        data.data.auth_result="T";
                    }else{
                        data.data.auth_result="F";
                    }
                    // if(data.data.auth_result=="T"){
                    //     that.setInfo(that.saveHuotiName,(that.getInfo(that.saveHuotiName)||"")+(that.apiConfig.pub_key+"{{#}}"+that.saveInfo.card)+",");
                    // }
                    var thresholds=data.data.thresholds["1e-3"]+","+data.data.thresholds["1e-4"]+","+data.data.thresholds["1e-5"];
                    that.setEndShow(data.data.auth_result,data.data.similarity);
                    that.pushCallback(data.data.auth_result,data.data.similarity,"","",thresholds,that.living_attack);
                    that.showStep(5);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "face_compare/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                data: JSON.stringify(postData),
                timeout:that.timeoutTime,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
            });
        },
        //h5:人脸比对组合接口
        api_compare: function() {
            var that = this;
            that.ErrorTip.show("处理中，请稍候", that.time2wait);
            var postData = {
                "header": {
                    "session_id": that.session_id,
                    "partner_order_id": that.partner_order_id,
                    "sign": "",
                    "sign_time": that.sign_time
                },
                "body": {
                    "photo1": {
                        "img_file_source": "2",
                        "img_file_type": "1",
                        "img_file": that.minPic[6].substr(that.minPic[6].indexOf(",")+1,that.minPic[6].length-1)
                    },
                    "photo2": {
                        "img_file_source": "0",
                        "img_file_type": "3",
                        "img_file": that.session_id
                    }
                }
            }
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                if (!data.result.success) {
                    // that.ErrorTip.show(data.result.message || data.result.errorcode,2000);
                    that.setEndShow("F","0");
                    that.pushCallback("F","0",data.result.errorcode||"999999",data.result.message||"系统异常");
                    that.showStep(5);
                } else {
                    that.ErrorTip.show("验证完成",100);
                    if(!data.data){
                        data.data={};
                    }
                    if(data.data.similarity>data.data.thresholds["1e-3"]){
                        data.data.auth_result="T";
                    }else{
                        data.data.auth_result="F";
                    }
                    var thresholds=data.data.thresholds["1e-3"]+","+data.data.thresholds["1e-4"]+","+data.data.thresholds["1e-5"];
                    that.setEndShow(data.data.auth_result,data.data.similarity);
                    that.pushCallback(data.data.auth_result,data.data.similarity,"","",thresholds);
                    that.showStep(5);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "face_compare/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                data: JSON.stringify(postData),
                timeout:that.timeoutTime,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
            });
        },
        setEndShow:function (auth_result,similarity) {
            var that=this;
            if(similarity){
                similarity=(+similarity).toFixed(2);
            }else{
                similarity=0;
            }
            var num_step=5;
            if(similarity<0.2){
                num_step=1;
            }else if(similarity<0.4){
                num_step=2;
            }else if(similarity<0.6){
                num_step=3;
            }else if(similarity<0.8){
                num_step=4;
            }
            if(similarity==0){
                $("#quan").attr("src","images/quan.png");
            }else {
                $("#quan").attr("src","images/num_step"+num_step+".png");
            }
            $("#like-num").text((similarity*100).toFixed(0)+"%");
            $("#suinfo_info").text({T:"认证通过",F:"认证未通过"}[auth_result]);
            $(".suinfo-pan").hide();
            $("#suinfo_"+auth_result).show();
            that.ErrorTip.show("验证完成",10);

        },
        pushCallback:function (auth_result,similarity,code,msg,thresholds,living_attack) {
            var that=this;
            if(that.callback_url){
                var url=that.callback_url
                    + (that.callback_url.indexOf("?")>-1?"&":"?")
                    + "partner_order_id="+that.partner_order_id
                    + "&similarity="+similarity
                    + "&result_auth="+auth_result;
                if(code){
                    url+="&errorcode="+code;
                }
                if(msg){
                    url+="&message="+msg;
                }
                if(thresholds){
                    url+="&thresholds="+thresholds;
                }
                if(living_attack){
                    url+="&living_attack="+living_attack;
                }
                $.get(url);
            }
            if(that.return_url){
                var url=that.return_url
                    + (that.callback_url.indexOf("?")>-1?"&":"?")
                    + "partner_order_id="+that.partner_order_id
                    + "&similarity="+similarity
                    + "&result_auth="+auth_result;
                if(code){
                    url+="&errorcode="+code;
                }
                if(msg){
                    url+="&message="+msg;
                }
                if(thresholds){
                    url+="&thresholds="+thresholds;
                }
                if(living_attack){
                    url+="&living_attack="+living_attack;
                }
                window.location.replace(url);
            }else{
                // that.closeWindow();
                that.showStep(5);
            }
        },
        setInfo:function(key,value){
            if(!key){
                return;
            }
            var exdate=new Date(+new Date()+30*24*60*60*1000)
            document.cookie=key+ "=" +escape(value)+";expires="+exdate.toGMTString();
            if(window.localStorage&&window.localStorage.setItem){
                window.localStorage.setItem(key,value);
            }
            if(window.sessionStorage&&window.sessionStorage.setItem){
                window.sessionStorage.setItem(key,value);
            }
        },
        getInfo:function (key) {
            if(!key){
                return "";
            }
            var retStr="";
            var arr,reg=new RegExp("(^| )"+key+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg)){
                retStr = unescape(arr[2]);
            }
            if(!retStr&&window.localStorage&&window.localStorage.getItem){
                retStr = window.localStorage.getItem(key);
            }
            if(!retStr&&window.sessionStorage&&window.sessionStorage.getItem){
                retStr = window.sessionStorage.getItem(key);
            }
            return retStr;
        },
        isColorPhoto:function(list){
            for(var i=0; i<list.length; i+=4){
                if(Math.max(list[i],list[i+1],list[i+2])-Math.min(list[i],list[i+1],list[i+2])>50){
                    return true;
                }
            }
            return false;
        }
    };

    $(document).ready(function() {
        h5_upload.init();
    });

})();
