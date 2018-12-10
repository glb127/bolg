(function() {
//分辨率
    var commonFn = (function() {
        var obj = {
            isTest:(location.host == "localhost:8098"||location.host == "10.10.0.90:8098"),
            rem: rem, //rem适配 commonFn.rem(document, window);
            waitLongTime: 600 * 1000, //转圈等待时间
            dateFormat: dateFormat, //时间格式化 commonFn.dateFormat(new Date(),'yyyyMMddhhmmss')
            setInfo: setInfo, //缓存数据 commonFn.setInfo("key","value")
            getInfo: getInfo, //获取缓存数据 commonFn.getInfo("key")
            isColorPhoto: isColorPhoto, //判断照片是否黑白 commonFn.isColorPhoto(list)
            ErrorTip: ErrorTip(), //弹框 commonFn.ErrorTip.show("参数缺失")
            closeWindow: closeWindow, //关闭窗口 commonFn.closeWindow()
            isPC: isPC, //是否pc commonFn.isPC()
            getUAinfo: getUAinfo, //获取UAParser commonFn.getUAinfo()
            putLog: putLog, //保存log
            getLog: getLog, //获取log，并清空
            idcardCut:idcardCut,//身份证掩码
            checkName:checkName,//验证身份证号码
            checkIdcard:checkIdcard,//验证身份证号码正确性
        }

        var saveLog = {};

        function putLog(type, action, content) {
            // init
            // check
            // picinfo
            // choosepic
            // post
            // post_error
            // result
            var that = this;
            var _map = {
                1: "sdk_ocr_front",
                2: "sdk_ocr_back",
                3: "sdk_ocr_manual",
                4: "h5v43_hack_check",
                5: "h5v45_hack_check",
                6: "h5v45_quality_check"
            };
            if (!saveLog[_map[type]]) {
                saveLog[_map[type]] = [];
            }
            saveLog[_map[type]].push({
                "action": action,
                "log_level": "info",
                "log_content": content,
                "log_time": +new Date(),
            })
        }

        function getLog() {
            var tmp = saveLog;
            saveLog = {}
            return tmp;
        }
        function checkName(str){
            var pattern = new RegExp(/^([\u4e00-\u9fa5\u3400-\u4db5]+(·[\u4e00-\u9fa5\u3400-\u4db5]+)*)$/);
            if(pattern.test(str)){
                return true;
            }else{
                return false;
            }
        }

        function checkIdcard(str){
            var pattern = new RegExp(/^\d{15}(\d{2}[\dxX])?$/);
            if(pattern.test(str)){
                return true;
            }else{
                return false;
            }
        }

        function idcardCut(str) {
            if( str.length<8){
                return str;
            }else{
                return str.substr(0, 4) + "************************".substr(0, str.length - 6) + str.substr(str.length - 2, 2);
            }
        }
        function rem(doc, win) {
            var docEl = doc.documentElement,
                resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
                recalc = function() {
                    var clientWidth = docEl.clientWidth;
                    if (!clientWidth) return;

                    //这里是假设在640px宽度设计稿的情况下，1rem = 20px；
                    //可以根据实际需要修改
                    docEl.style.fontSize = 20 * (clientWidth / 640) + 'px';
                };
            if (!doc.addEventListener) return;
            win.addEventListener(resizeEvt, recalc, false);
            doc.addEventListener('DOMContentLoaded', recalc, false);
        }

        function getUAinfo() {
            /*{ua: "",browser: {name: "",version: ""},engine: {name: "",version: ""},os: {name: "",version: ""},device: {model: "",type: "",vendor: ""},cpu: {architecture: ""}}*/
            var result = {};
            try {
                result = new UAParser().getResult();
            } catch (e) {}
            return result;
        }

        function dateFormat(_date, fmt) {
            //yyyy-MM-dd HH:mm:ss
            if (!_date) { return "" };
            var date = new Date(_date);
            if (date == "Invalid Date") {
                date = new Date(+_date);
            }
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
                "H+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            var week = {
                "0": "/u65e5",
                "1": "/u4e00",
                "2": "/u4e8c",
                "3": "/u4e09",
                "4": "/u56db",
                "5": "/u4e94",
                "6": "/u516d"
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }

        function setInfo(key, value) {
            if (!key) {
                return;
            }
            var exdate = new Date(+new Date() + 30 * 24 * 60 * 60 * 1000)
            document.cookie = key + "=" + escape(value) + ";expires=" + exdate.toGMTString();
            if (window.localStorage && window.localStorage.setItem) {
                window.localStorage.setItem(key, value);
            }
            if (window.sessionStorage && window.sessionStorage.setItem) {
                window.sessionStorage.setItem(key, value);
            }
        }

        function getInfo(key) {
            if (!key) {
                return "";
            }
            var retStr = "";
            var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                retStr = unescape(arr[2]);
            }
            if (!retStr && window.localStorage && window.localStorage.getItem) {
                retStr = window.localStorage.getItem(key);
            }
            if (!retStr && window.sessionStorage && window.sessionStorage.getItem) {
                retStr = window.sessionStorage.getItem(key);
            }
            return retStr;
        }

        function isColorPhoto(list) {
            for (var i = 0; i < list.length; i += 4) {
                if (Math.max(list[i], list[i + 1], list[i + 2]) - Math.min(list[i], list[i + 1], list[i + 2]) > 50) {
                    return true;
                }
            }
            return false;
        }

        function ErrorTip() {
            var dom = "<div  id='ErrorTipModal' class='error_tip_frame'><div class='error_tip_inner'>{{message}}</div></div>";
            var obj, time;

            function hide() {
                if (obj && obj.fadeOut) {
                    clearTimeout(time);
                    obj.stop();
                    obj.remove();
                    obj = "";
                }
            };

            function show(message, wait) {
                putLog(3, "ErrorTip", { msg: message });
                if (!message) { return; }
                if (obj) {
                    clearTimeout(time);
                    obj.stop();
                    obj.remove();
                    obj = "";
                }
                var deTime = message.length * 200 + 500;
                if (deTime > 15000) { deTime = 15000; }
                obj = $(dom.replace("{{message}}", message)).appendTo("body");
                // obj.click(function(e) {
                //     if (obj && obj.fadeOut) {
                //         clearTimeout(time);
                //         obj.stop();
                //         obj.remove();
                //         obj = "";
                //     }
                // })
                time = setTimeout(function() {
                    obj.fadeOut(300, function() {
                        obj.stop();
                        obj.remove();
                        obj = "";
                    });
                }, wait || deTime);
            }
            return {
                show: show,
                hide: hide
            }
        }

        function closeWindow() {
            try {
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    WeixinJSBridge.call('closeWindow');
                } else if (ua.indexOf("alipay") != -1) {
                    AlipayJSBridge.call('closeWebview');
                } else if (ua.indexOf("baidu") != -1) {
                    BLightApp.closeWindow();
                }
            } catch (e) {}
            window.opener = null;
            window.open("about:blank", "_self");
            window.close();
            window.history.go(-1)
        }


        //判断是否pc
        function isPC() {
            var userAgent = navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("windows phone") >= 0) {
                return false;
            } else if (userAgent.indexOf("symbianos") >= 0) {
                return false;
            } else if (userAgent.indexOf("android") >= 0) {
                return false;
            } else if (userAgent.indexOf("iphone") >= 0 || userAgent.indexOf("ipad") >= 0 || userAgent.indexOf("iPod") >= 0 || userAgent.indexOf("ios") >= 0) {
                return false;
            } else {
                return true;
            }
        }


        return obj;
    })()

    //主函数
    var h5_upload = {
        /********** 数据 **********/
        data: {
            url: "",
            logurl: "",
            minPic: {  }, //保存照片 1: "", 2: "", 4: ""
            savePostPic: {  }, //保存上传结果，防止重复提交
            session_id: "", //套餐会话ID
            cardInfo: {
                name: "",
                card: "",
                gender: "",
                time: "",
                cardshow: ""
            }, //保存正反面照需要信息
            step1ok:false,
            comparedata:false,
            compareRetry:0,
        },

        //初始化
        init: function() {

            var that = this;
            that.Request = that.getRequest();

            //不同环境不同url
            that.data.url = "https://idsafe-auth.udcredit.com/front/4.3/api/";
            if (that.Request.url_type) {
                that.data.url = {
                    "cs": "http://10.1.30.51:8080/idsafe-front/front/4.3/api/",
                    "cs2": "http://10.1.30.51:8080/idsafe-front/front/4.3/api/",
                    "zs": "https://idsafe-auth.udcredit.com/front/4.3/api/",
                    "zs-a": "https://idsafe-auth-a.udcredit.com/front/4.3/api/",
                    "zs-b": "https://idsafe-auth-b.udcredit.com/front/4.3/api/",
                } [that.Request.url_type] || that.data.url;
            }
            that.data.logurl = "/front/las/4.3/log/post_log/processor/idsafe_h5_front";
            if (that.Request.url_type == "cs2") {
                that.data.logurl = "http://10.1.30.51:8080/las-front/las/4.3/log/post_log/processor/idsafe_h5_front";
            }
            if (commonFn.isTest) {
                that.data.logurl = "/las-front/las/4.3/log/post_log/processor/idsafe_h5_front";
            }

            //绑定事件
            that.eventBind();

            //初始页面，有姓名和身份证号的自动跳转实名验证
            if (that.Request.step_num) {
                that.showStep(that.Request.step_num);
            } else if (that.Request.id_name && that.Request.id_number) {
                that.showStep(4);
                $("#agreement2").show();
            } else {
                $("#upload2").hide()
                that.showStep(1);
            }
            //是pc的则调整ui
            if (commonFn.isPC()) {
                $("html").addClass("pc");
                $("#upload1,#upload2,#upload4").attr("accept", "image/png,image/jpg,image/jpeg"); //hack mac safari 上传不加accept很慢
            } else {
                //防止手机输入按键使页面上移
                setTimeout(function (argument) {
                    $('body').height($('body')[0].clientHeight)
                },1000);
                commonFn.rem(document, window);
            }
            $("html").show();

            commonFn.putLog(1, "h5init", commonFn.getUAinfo());
            commonFn.putLog(1, "h5url", location.href);

            //判断是否有pub_key，没有则提示参数缺失
            if (!that.Request.step_num&&!that.Request.pub_key) {
                commonFn.ErrorTip.show("参数缺失，请联系客服[100002]");
                commonFn.putLog(1, "request_error", { msg: "no pub_key" });
            } else {
                commonFn.putLog(1, "h5request", that.Request);
            }
        },

        //获取参数并初始化
        getRequest: function() {
            var defaultOption = {
                pub_key: "", //公钥，与sign中使用的一致
                sign_time: commonFn.dateFormat(new Date(), 'yyyyMMddhhmmss'), //格式yyyyMMddhhmmss，与sign中使用的一致
                sign: "", //签名
                url_type: "zs", //商户订单号，测试时默认cs，上线时默认zs（cs：测试，zs：正式，zs-a：正式a，zs-b：正式b）
                partner_order_id: "auto_" + (+new Date()), //商户订单号  测试时默认时间戳,与签名中一致
                callback_url: "", //回调商户url
                return_url: "", //回显页面
                id_name: "", //身份证姓名
                id_number: "", //身份证号码
                verify_and_compare: "1", //是否使用人脸比对
                face_retry_time: "0", //重试次数
            }

            var url = decodeURI(location.search); //获取url中"?"符后的字串
            var theRequest = new Object();
            var str = "",
                strs = "";
            if (url.indexOf("?") != -1) {
                str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].substr(strs[i].indexOf("=") + 1));
                }
            }
            if (theRequest["apiparams"]||theRequest["dp"]) {
                str = "", key = "";
                if (theRequest["apiparams"]) {
                    str = theRequest["apiparams"];
                    key = "4c43a8be" + "85b64563a322" + "44db9caf8454";
                }
                if (theRequest["dp"]) {
                    str = theRequest["dp"];
                    key = "ud_yhy_demo_text";
                }
                var decryptedData = "";
                try {
                    decryptedData = CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(key), {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    }).toString(CryptoJS.enc.Utf8);
                } catch (e) {}

                var strs = decryptedData.split("&");
                var theRequest = new Object();
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].substr(strs[i].indexOf("=") + 1));
                }
            }
            var retobj=$.extend({}, defaultOption, theRequest)
            if(!/^[0-9]{1,1}$/.test(retobj.face_retry_time)){
                retobj.face_retry_time="0";
            }
            retobj.face_retry_time=+retobj.face_retry_time;
            if (retobj.id_name&&!commonFn.checkName(retobj.id_name)){
                retobj.id_name=""
            }
            if (retobj.id_number&&!commonFn.checkIdcard(retobj.id_number)){
                retobj.id_number=""
            }
            return retobj;
        },
        showStep: function(index) {
            var that = this;
            $(".step").hide();
            $("#step" + index).show();
            $(".help-center").removeClass("b");

            if (index == "1") {
                commonFn.putLog(1, "init", { msg: "into_1" });
                $("title").html("添加身份证信息");
            } else if (index == "3") {
                commonFn.putLog(3, "init", { msg: "into_3" });
                $("title").html("确认信息");
                //赋值
                $("#cname").val(that.data.cardInfo.name);
                $("#ccard").val(that.data.cardInfo.cardshow);
                if (that.data.cardInfo.gender == "女") {
                    $("#check_w").show();
                    $("#check_m").hide();
                } else {
                    $("#check_w").hide();
                    $("#check_m").show();
                }

            } else if (index == "4") {
                commonFn.putLog(3, "init", { msg: "into_4" });
                $("title").html("上传手持身份证照片");
                $(".help-center").addClass("b");
            } else if (index == "5") {
                commonFn.putLog(3, "init", { msg: "into_5" });
                $("title").html("认证结果");
            }
        },
        //ajax错误
        ajaxErrorFn: function(that, xhr, textStatus) {
            commonFn.putLog(3, "post_error", { xhr: xhr, textStatus: textStatus });
            that.postAllLog();
            if (textStatus == "timeout") {
                commonFn.ErrorTip.show("网络异常，请稍后再试[420002]", 3000);
            } else {
                commonFn.ErrorTip.show("网络异常，请稍后再试[420003]", 3000);
            }
        },
        showErrorCode: function(url,data) {
            var index=3;
            if(url=="idcard_front_photo_ocr"){//敏感信息保护
                if(data&&data.data&&data.data.id_number){
                    data=JSON.parse(JSON.stringify(data));
                    data.data.id_number=commonFn.idcardCut(data.data.id_number);
                }
            }
            commonFn.putLog(index,"post",{msg:url,data:data});
            if(!data.result.success){
                if(data.result&&data.result.errorcode=="100004"){//超时
                    commonFn.ErrorTip.show("操作超时，请重新操作[400004]");
                }else if(data.result&&data.result.errorcode=="500003"){//接口异常
                    commonFn.ErrorTip.show("接口超时，请重新操作[500003]");
                }else if(data.result&&data.result.errorcode=="500015"){
                    commonFn.ErrorTip.show("认证失败，请重新验证[500015]");
                }else if(url=="idcard_front_photo_ocr"||url=="idcard_back_photo_ocr"||url=="idcard_quality_check"){
                    commonFn.ErrorTip.show("身份证检测未通过，请重新拍摄清晰完整的本人身份证["+data.result.errorcode+"]");
                }else if(url=="update_ocr_info"){
                    commonFn.ErrorTip.show("修改姓名失败，请重新["+data.result.errorcode+"]");
                }else if(url=="idcard_inhand_hack"||url=="idcard_inhand_compare"){
                    commonFn.ErrorTip.show("手持身份证照片验证未通过，请重新拍摄["+data.result.errorcode+"]");
                }else{
                    commonFn.ErrorTip.show("系统异常，请重新操作["+data.result.errorcode+"]");
                }
                return false;
            } else{
                return true;
            }

        },
        postAllLog: function() {
            var that = this;
            var saveLog = commonFn.getLog();
            var _newDate = +new Date()
            for (var stage in saveLog) {
                if (saveLog[stage] && saveLog[stage].length) {
                    var postData = {
                        "header": {
                            "log_id": "h5_" + that.Request.sign_time,
                            "pub_key": that.Request.pub_key,
                            "partner_order_id": that.Request.partner_order_id,
                            "platform": "h5",
                            "stage": stage,
                            "upload_time": _newDate,
                            "sign": that.Request.sign,
                            "sign_time": that.Request.sign_time,
                            "session_id": that.data.session_id,
                        },
                        "body": saveLog[stage]
                    }

                    $.ajax({
                        type: "POST",
                        url: that.data.logurl + "?partner_order_id=" + that.Request.partner_order_id + "&stage=" + stage, //http://10.1.30.51:8000/
                        timeout: that.timeoutTime,
                        data: JSON.stringify(postData),
                        dataType: "json",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                }
            }
        },

        clearInputFile: function(index) {
            var that = this;
            var file = $("#upload" + index);
            file.after(file.clone().val(""));
            file.remove();
            that.eventBindPic(index);
        },
        //绑定事件
        eventBind: function() {
            var that = this;
            //异常时提交
            window.onerror = function(errMsg, scriptURI, lineNumber, columnNumber, errorObj) {
                setTimeout(function() {
                    var rst = {
                        "errMsg": errMsg,
                        "scriptURI": scriptURI,
                        "lineNumber": lineNumber,
                        "columnNumber": columnNumber,
                        "errorObj": errorObj
                    };
                    // 弹出异常
                    if (commonFn.isTest) {
                        alert(JSON.stringify(rst));
                    } else {
                        commonFn.putLog(3, "error", rst);
                        that.postAllLog();
                        commonFn.ErrorTip.show("网络异常，请稍后再试[420001]", commonFn.waitLongTime);
                        setTimeout(function() {
                            location.reload();
                        }, 2000);
                    }
                });
                return false;
            };
            //关闭日志
            window.onbeforeunload = function() {
                commonFn.putLog(3, "close", { msg: "close" });
                that.postAllLog();
            };
            $("img").bind("click", function(e) {
                e.preventDefault();
            });
            that.eventBindPic(1);
            that.eventBindPic(2);
            that.eventBindPic(4);
            $("#submit1").bind("click", function() {
                commonFn.putLog(1, "check", { msg: "btn_1" });
                that.upload1();
            });
            $("#submit3").bind("click", function() {
                commonFn.putLog(3, "check", { msg: "btn_3" });
                that.upload3();
            });
            $("#submit4").bind("click", function() {
                commonFn.putLog(3, "check", { msg: "btn_4" });
                that.upload4();
            });
            $("#submit5").bind("click", function() {
                commonFn.putLog(3, "check", { msg: "btn_5" });
                commonFn.closeWindow();
            });
            $("#isagreement1").bind("change", function() {
                that.check_submit1();
                commonFn.putLog(1, "check", { msg: "agreement1", checked: ($("#isagreement1:checked").length ? "y" : "n") });
            });
            $("#isagreement2").bind("change", function() {
                that.check_submit4();
                commonFn.putLog(3, "check", { msg: "agreement2", checked: ($("#isagreement2:checked").length ? "y" : "n") });
            });
            $("#agreement1_show").bind("click", function() {
                commonFn.putLog(1, "check", { msg: "go_agreement1" });
            });
            $("#agreement2_show").bind("click", function() {
                commonFn.putLog(3, "check", { msg: "go_agreement2" });
            });
        },
        //绑定改变照片事件事件
        eventBindPic: function(index) {
            var that = this;
            $("#upload" + index).bind("change", function() {
                commonFn.putLog(index > 2 ? 3 : index, "check", { msg: "pic_" + index });
                if (this.files.length && this.files[0]) {
                    commonFn.ErrorTip.show("加载中，请稍后", commonFn.waitLongTime);
                } else {
                    commonFn.ErrorTip.show("照片加载失败，请重新操作[420011]");
                    return;
                }
                var file = this.files[0];
                var img = new Image();
                var blob = URL.createObjectURL(file);
                var lastModified=new Date();
                if(file.lastModified){
                    lastModified=file.lastModified;
                }else if(file.lastModifiedDate){
                    lastModified=new Date(file.lastModifiedDate);
                }
                //判断时间，10秒以上重拍
                if(!commonFn.isTest&&Math.abs(new Date()-lastModified)>10000){
                    commonFn.putLog(3 , "error", { msg: "pic_" + index+" wrong lastModified" });
                    commonFn.ErrorTip.show("身份证检测未通过，请重新拍摄清晰完整的本人身份证[420012]");
                    return
                }
                //某些机型 img.src = blob 会 error
                img.onerror = function(a1) {
                    commonFn.putLog(3, "error", { msg: "pic_" + index + " cant src img" });
                    if (index == 1 || index == 2) {
                        commonFn.ErrorTip.show("拍摄失败，请升级手机系统或微信右上角选择在浏览器中打开[420013]");
                    } else {
                        commonFn.ErrorTip.show("该手机系统版本前置拍摄异常，请尝试切换后置摄像头拍摄[420014]");
                    }
                }
                img.onload = function(a1) {
                    var img_w = "";
                    var img_h = "";
                    try {
                        img_w = a1.currentTarget.width;
                        img_h = a1.currentTarget.height;
                    } catch (e) {}

                    lrz(file, { width: 800 }).then(function(rst) {
                        try {
                            for (var ent in rst.origin.exifdata) {
                                if ((rst.origin.exifdata[ent] + "").length > 100) {
                                    rst.origin.exifdata[ent] = rst.origin.exifdata[ent].sub(0, 100) + "...";
                                }
                            }
                        } catch (e) {}
                        try {
                            commonFn.putLog(index > 2 ? 3 : index, "pic_info", {
                                msg: (rst && rst.origin) ? {
                                    name: rst.origin.name,
                                    size: rst.origin.size,
                                    width: img_w,
                                    height: img_h,
                                    fileLen: rst.fileLen,
                                    type: rst.origin.type,
                                    lastModified: rst.origin.lastModified,
                                    lastModifiedDate: rst.origin.lastModifiedDate,
                                } : {}
                            });
                            commonFn.putLog(index > 2 ? 3 : index, "pic_exifdata", { msg: (rst && rst.origin && rst.origin.exifdata) ? rst.origin.exifdata : {} });
                        } catch (e) {}

                        that.compress(rst.base64, index);
                    });
                }
                img.src = blob;
            });
        },
        //压缩照片
        compress: function(res, index) {
            var that = this,
                img = new Image();
            setTimeout(function() {
                img.src = res;
            }, 10);

            img.onload = function() {

                // //黑白
                // if (!commonFn.isColorPhoto(ctx.getImageData(0, 0, img.width, img.height).data)) {
                //     commonFn.putLog(index > 2 ? 3 : index, "pic_nocolor", { msg: "pic_" + index });
                //     if (index == 4) {
                //         commonFn.ErrorTip.show("手持身份证照片检测未通过，请参考页面提示重新拍摄[420015]");
                //     } else {
                //         commonFn.ErrorTip.show("身份证检测未通过，请重新拍摄清晰完整的本人身份证[420015]");
                //     }
                //     that.clearInputFile(index);
                //     return;
                // }
                that.data.minPic[index] = res;
                that.clearInputFile(index);

                if(index==1||index==2){
                    var width=img.width < img.height?(img.width / img.height * 60):100;
                    that.uploadCard.call(that,index,width);

                }else if(index==4){
                    var width=img.width < img.height?(img.width / img.height * 100):100;
                    $("#uploadpic" + index).css("width", width + "%");
                    $("#uploadpic" + index).attr("src",  res);
                    that.check_submit4()
                    commonFn.ErrorTip.hide()
                }
            };
        },
        check_submit1: function() {
            var that = this;
            $("#submit1").removeClass("active");
            $("#uploadpic2").removeClass("imgdemo-disable");
            if(!that.data.cardInfo.name){
                $("#uploadpic2").addClass("imgdemo-disable");
            }
            if(that.data.step1ok==true&& $("#isagreement1:checked").length != 0){
                $("#submit1").addClass("active");
            }
        },
        check_submit4: function() {
            var that = this;
            $("#submit4").removeClass("active");
            if(that.data.minPic[4] && !($("#agreement2").css("display") != "none" && $("#isagreement2:checked").length == 0)){
                $("#submit4").addClass("active");
            }
        },
        //api:验证身份证正反面清晰度
        chexk_quality:function(index,data,callback){
            var that=this;
            function check_successFn(data) {
                if(that.showErrorCode("idcard_quality_check",data)){
                    that.clearInputFile(index);
                    var lanjie=false;
                    try{
                      if(data.data.incomplete>0.5||data.data.blurry>0.5){
                        lanjie=true;
                      }
                    }catch(e){}
                    if(lanjie){
                        commonFn.ErrorTip.show("身份证检测未通过，请重新拍摄清晰完整的本人身份证[420021]");
                        commonFn.putLog(6,"quality_pic",data.data.idcard_photo);
                    }else{
                        callback();
                    }
                }
                that.postAllLog();
            }
            $.ajax({
                type: "POST",
                url: that.data.url + "idcard_quality_check/pub_key/" + that.Request.pub_key + "/platform/h5",
                timeout:that.timeoutTime,
                data: JSON.stringify(data),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: check_successFn,
                error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
            });
        },
        //api:身份证正面OCR识别接口
        uploadCard: function(index,width) {
            var that = this;
            if (!that.Request.pub_key) {
                commonFn.ErrorTip.show("参数缺失，请联系客服[100002]");
                return;
            }
            if (!that.data.minPic[index]) {
                commonFn.ErrorTip.show("身份证检测未通过，请重新拍摄清晰完整的本人身份证[420016]");
                that.clearInputFile(index);
                return;
            }
            var photo=that.data.minPic[index].substr(that.data.minPic[index].indexOf(",") + 1, that.data.minPic[index].length - 1);
            var postData = {
                "header": {
                    "session_id": that.data.session_id,
                    "partner_order_id": that.Request.partner_order_id,
                    "sign": that.Request.sign,
                    "sign_time": that.Request.sign_time
                },
                "body": {}
            }
            if (that.data.savePostPic[index]==photo) {
                commonFn.ErrorTip.show("请重新拍摄清晰完整的身份证照片[420017]");
                return;
            }
            that.data.savePostPic[index]=photo;

            var check_postData= $.extend(true, {}, postData);
            check_postData.body.idcard_photo=photo;
            var murl="";
            if(index==1){
                murl="idcard_front_photo_ocr";
                postData.body.idcard_front_photo=photo;
            }else if(index==2){
                murl="idcard_back_photo_ocr";
                postData.body.idcard_back_photo=photo;
            }
            that.chexk_quality(index,check_postData,post);


            function successFn(data) {
                if(that.showErrorCode(murl,data)){
                    $("#uploadpic" + index).css("width", width + "%");
                    $("#uploadpic"+index).attr("src",  that.data.minPic[index]);
                    $("#uploadpic"+index).parent().addClass("uploadpic-pan");
                    $("#upload"+index).hide();
                    $("#uploadok"+index).show();

                    if(index==1){
                        $("#upload2").show()
                        that.data.cardInfo.name = data.data.id_name;
                        that.data.cardInfo.card = data.data.id_number;
                        that.data.cardInfo.gender = data.data.gender;
                        that.data.cardInfo.cardshow = commonFn.idcardCut(data.data.id_number);
                        if(data.data.session_id){
                            that.data.session_id = data.data.session_id;
                        }
                    }else if(index==2){
                        that.data.cardInfo.time = data.data.validity_period;
                        that.data.step1ok=true;
                    }
                    that.check_submit1();
                    commonFn.ErrorTip.hide();
                }
                that.postAllLog();
            }
            function post(){
                $.ajax({
                    type: "POST",
                    url: that.data.url + murl + "/pub_key/" + that.Request.pub_key + "/platform/h5",
                    timeout: that.timeoutTime,
                    data: JSON.stringify(postData),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: successFn,
                    error: function(xhr, status) { that.ajaxErrorFn(that, xhr, status); },
                });
            }
        },
        upload1: function () {
            var that=this;
            if(!that.data.step1ok){
                commonFn.ErrorTip.show("请您先拍摄身份证");
            }else if ($("#agreement1").css("display") != "none" && $("#isagreement1:checked").length == 0) {
                commonFn.ErrorTip.show("请您先阅读并勾选《用户协议》");
            }else{
                that.showStep(3);
            }

        },
        //api:OCR识别结果更新接口，修改姓名提交
        upload3: function() {
            var that = this;
            var name = $.trim($("#cname").val());
            var namePattern = new RegExp("^([\u4e00-\u9fa5\u3400-\u4db5]+(·[\u4e00-\u9fa5\u3400-\u4db5]+)*)$");
            if (!that.data.session_id) {
                commonFn.ErrorTip.show("请按顺序进行验证");
            } else if (!name) {
                commonFn.ErrorTip.show("请输入身份证姓名");
            } else if (!commonFn.checkName(name)) {
                commonFn.ErrorTip.show("姓名格式错误，请重新输入");
            } else if (that.data.cardInfo.name == name) {
                    that.showStep(4);
            } else {
                commonFn.ErrorTip.show("正在修改姓名，请稍候", commonFn.waitLongTime);
                var postData = {
                    "header": {
                        "session_id": that.data.session_id,
                        "partner_order_id": that.Request.partner_order_id,
                        "sign": that.Request.sign,
                        "sign_time": that.Request.sign_time
                    },
                    "body": {
                        id_name: name
                    }
                }
                function successFn(data) {
                    if(that.showErrorCode("update_ocr_info",data)){
                        commonFn.ErrorTip.hide();
                        if(data.data.session_id){
                            that.data.session_id = data.data.session_id;
                        }
                        that.data.cardInfo.name = name;
                        that.showStep(4);
                    }
                    that.postAllLog();
                }
                $.ajax({
                    type: "POST",
                    url: that.data.url + "update_ocr_info/pub_key/" + that.Request.pub_key + "/platform/h5",
                    timeout: that.timeoutTime,
                    data: JSON.stringify(postData),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: successFn,
                    error: function(xhr, status) { that.ajaxErrorFn(that, xhr, status); },
                });
            }
        },
        //api:上传照片认证
        upload4: function() {
            var that = this;
            if ($("#agreement2").css("display") != "none" && $("#isagreement2:checked").length == 0) {
                commonFn.ErrorTip.show("请您先阅读并勾选《用户协议》");
                return;
            }

            if (!that.data.minPic[4]) {
                commonFn.ErrorTip.show("请先拍摄清晰完整的手持身份证照片[420016]");
                that.clearInputFile(4);
            } else if (that.data.savePostPic[4]==that.data.minPic[4]) {
                commonFn.ErrorTip.show("请重新拍摄清晰完整的手持身份证照片[420017]");
            }else {
                that.data.savePostPic[4]=that.data.minPic[4]
                that.api_hake();
            }

        },
        //api:防骇客
        api_hake: function() {
            var that = this;
            commonFn.ErrorTip.show("验证中，请稍候", commonFn.waitLongTime);
            var photo=that.data.minPic[4].substr(that.data.minPic[4].indexOf(",") + 1, that.data.minPic[4].length - 1);
            var postData = {
                "header": {
                    "session_id": that.data.session_id,
                    "partner_order_id": that.Request.partner_order_id,
                    "sign": that.Request.sign,
                    "sign_time": that.Request.sign_time
                },
                "body": {
                    "idcard_in_hand_photo": photo
                }
            }
            function successFn(data) {
                if (data.data && data.data.photo) {
                    commonFn.putLog(3, "hack_pic", data.data.photo);
                }
                if(that.showErrorCode("idcard_inhand_hack",data)){
                    if (data.data.classify == "0") {
                        commonFn.putLog(5, "hack_pic", data.data.photo);
                        commonFn.ErrorTip.show("手持身份证照片检测未通过，请重试[420022]");
                    } else {
                        that.api_compare();
                    }
                }else{
                    if(data.data&&data.data.photo){
                        commonFn.putLog(5, "hack_pic", data.data.photo);
                    }
                    that.api_compare();
                }
                that.postAllLog();
            }
            $.ajax({
                type: "POST",
                url: that.data.url + "idcard_inhand_hack/pub_key/" + that.Request.pub_key + "/platform/h5",
                data: JSON.stringify(postData),
                timeout: that.timeoutTime,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error: function(xhr, status) { that.h5_check(); },
            });
        },
        //api:人脸比对接口
        api_compare: function() {
            var that = this;
            var photo=that.data.minPic[4].substr(that.data.minPic[4].indexOf(",") + 1, that.data.minPic[4].length - 1);
            var postData = {
                "header": {
                    "session_id": that.data.session_id,
                    "partner_order_id": that.Request.partner_order_id,
                    "sign": that.Request.sign,
                    "sign_time": that.Request.sign_time
                },
                "body": {
                    idcard_in_hand_photo: photo
                }
            }

            function successFn(data) {
                var obj={
                    "result_auth":"F",
                    "result_inhand_similarity":""
                }
                if(data.data){
                    if(data.data.session_id){
                        that.data.session_id = data.data.session_id;
                    }
                    that.data.comparedata=data.data;
                    if(data.data.similarity){
                        obj.result_inhand_similarity=data.data.similarity;
                    }
                    if (data.data.similarity>0.7) {
                        obj.result_auth="T";
                    }
                }else{
                    that.data.comparedata.similarity="";
                }
                if(data.result&&data.result.errorcode=="100004"){//超时
                    commonFn.ErrorTip.show("操作超时，请重新操作[400004]");
                    return;
                }
                var isSuccess=that.showErrorCode("idcard_inhand_compare",data);
                //异常重试
                if(!isSuccess){
                    return;
                }
                if(!isSuccess||(isSuccess&&obj.result_auth=="F")){
                    if(that.data.compareRetry<that.Request.face_retry_time){
                        if(isSuccess){
                            commonFn.ErrorTip.show("手持身份证照片验证未通过，请重试[420023]");
                        }
                        that.data.compareRetry=that.data.compareRetry+1;
                        return
                    }
                }
                if(that.Request.verify_and_compare=="1"){
                    that.api_check();
                }else{
                    commonFn.ErrorTip.hide();
                    that.pushCallback(obj);
                }
                that.postAllLog();

            }
            $.ajax({
                type: "POST",
                url: that.data.url + "idcard_inhand_compare/pub_key/" + that.Request.pub_key + "/platform/h5",
                data: JSON.stringify(postData),
                timeout: that.timeoutTime,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error: function(xhr, status) { that.ajaxErrorFn(that, xhr, status); },
            });
        },
        //api:人像比对接口
        api_check: function() {
            var that = this;
            var postData = {
                "header": {
                    "session_id": that.data.session_id,
                    "partner_order_id": that.Request.partner_order_id,
                    "sign": that.Request.sign,
                    "sign_time": that.Request.sign_time
                },
                "body": {
                    id_number: that.data.cardInfo.card || that.Request.id_number,
                    id_name: that.data.cardInfo.name || that.Request.id_name,
                    photo: {
                        img_file_source: 0,
                        img_file_type: 4,
                        img_file: that.data.session_id
                    }
                }
            }

            function successFn(data) {
                if(that.showErrorCode("verify_and_compare",data)){
                    commonFn.ErrorTip.hide();
                    var suggest_result="F";
                    if(data.data.suggest_result=="T"&&that.data.comparedata.similarity>0.7){
                        suggest_result="T";
                    }
                    that.pushCallback({
                        "result_auth":suggest_result,
                        "result_status":data.data.result_status,
                        "verify_status":data.data.verify_status,
                        "result_inhand_similarity":that.data.comparedata.similarity
                    });
                }else{
                    that.pushCallback({
                        "result_auth":"F",
                        "result_inhand_similarity":that.data.comparedata.similarity
                    });
                }
                that.postAllLog();
            }
            $.ajax({
                type: "POST",
                url: that.data.url + "verify_and_compare/pub_key/" + that.Request.pub_key + "/platform/h5",
                data: JSON.stringify(postData),
                timeout: that.timeoutTime,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error: function(xhr, status) { that.ajaxErrorFn(that, xhr, status); },
            });
        },

        pushCallback: function(obj) {
            var that = this;
            obj.partner_order_id=that.Request.partner_order_id;
            var param=[];
            for(var i in obj){
                if(obj[i]!==""){
                    param.push(i+"="+obj[i])
                }
            }
            param=param.join("&");
            if (that.Request.callback_url) {
                var url = that.Request.callback_url
                        +(that.Request.callback_url.indexOf("?") > -1 ? "&" : "?")
                        +param;
                $.get(url);
                commonFn.putLog(3, "result", { msg: "post", data: url });
            }
            if (that.Request.return_url) {
                var url = that.Request.return_url
                        +(that.Request.return_url.indexOf("?") > -1 ? "&" : "?")
                        +param;
                setTimeout(function() {
                    window.location.replace(url);
                }, 1000);
                commonFn.putLog(3, "result", { msg: "open", data: url });
            } else {
                commonFn.putLog(3, "result", { msg: "show", data: obj });
                $(".suinfo").hide();
                $("#suinfo_" + obj.result_auth).show();
                that.showStep(5);
            }
            that.postAllLog();
        }
    };

    $(document).ready(function() {
        h5_upload.init();
    });

})();