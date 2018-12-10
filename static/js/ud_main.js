
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
    if(Request["dp"]){
        var decryptedData = CryptoJS.AES.decrypt(Request["dp"], CryptoJS.enc.Utf8.parse("ud_yhy_demo_text"), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8);
        Request = (function () {
            var strs = decryptedData.split("&");
            var theRequest = new Object();
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].substr(strs[i].indexOf("=")+1));
            }
            return theRequest;
        })();
    }


    //主函数
    var h5_upload = {
/********** 商户信息 **********/
        pub_key: Request["pub_key"]||"", //公钥，与sign中使用的一致
        sign_time: Request["sign_time"]||(new Date()).format('yyyyMMddhhmmss'), //格式yyyyMMddhhmmss，与sign中使用的一致
        sign: Request["sign"]||"", //签名
        step_num: Request["step_num"], //第几步，可用于查看按钮背景色改变后效果（1：身份证正反面页面，2：修改姓名页面，3：上传视频页面，4：结果页面）
        url_type: Request["url_type"]||"zs", //商户订单号，测试时默认cs，上线时默认zs（cs：测试，zs：正式，zs-a：正式a，zs-b：正式b）
        partner_order_id: Request["partner_order_id"]||(+new Date()), //商户订单号  测试时默认时间戳,与签名中一致
        package_code: Request["package_code"]||"TC010", //套餐代码
        extension_info: Request["extension_info"]||"", //扩展信息
        btn_color:Request["btn_color"]||"#12addd", //按钮颜色，格式为url('。。。') 或 #333 或 red
        finally_color:Request["finally_color"]||"url('./images/blueback.png')", //结果页背景颜色，格式为url('。。。') 或 #333 或 red
        callback_url:Request["callback_url"]||"", //回调商户url
        id_name:Request["id_name"]||"", //身份证姓名
        id_number:Request["id_number"]||"", //身份证号码
        is_api:Request["is_api"]||"", //是否api
        return_url:Request["return_url"]||"", //回显页面

/********** 常量 **********/
        time2wait : 600*1000,//转圈等待时间
        maxvideosize: 5,//最多视频大小，单位兆
        nowPiczorf:1,//目前要排的是正面还是反面
        saveHuotiCS:"ud_htcsnum",//调用次数记录
        saveHuotiName:"ud_htname",//已认证
        reTestTime:3,//24小时重试次数
        timeoutTime:20*1000,//超时时间

/********** 缓存数据 **********/
        minPic: {
            1: "",
            2: ""
        }, //保存压缩后的照片
        minVid:"", //保存压缩后的视频
        savePostPic1: {}, //保存正面照上传结果，防止重复提交
        savePostPic2: {}, //保存反面照上传结果
        savePostPic6: {}, //保存反面照上传结果
        saveInfo: {
            name: "",
            card: "",
            time: "",
            cardshow:""
        }, //保存正反面照需要信息
        return_photo: "",//优图返回图片
        package_session_id: "", //套餐会话ID


        //初始化
        init: function() {
            var that = this;
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
                if(that.is_api=="1"){
                    that.showStep(6);
                }else{
                    that.get_package_session_id();
                    $("#agreement2").show();
                }
            }else{
                if(that.is_api=="1"){
                    $("#agreement1").hide();
                }
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
                    that.ErrorTip.show("网络异常，请重新认证",that.time2wait);
                    setTimeout(function(){
                        location.reload();
                    },2000);
                });
                return false;
            };
        },
        //渲染颜色
        initColor: function () {
            var that = this;
            $("#step5").css({"background":that.finally_color,"background-size":"100% 100%"});
            $(".submit-btn").css({"background":that.btn_color,"background-size":"100% 100%"});
            if(that.is_api=="1"){
                $(".type-h5").remove();
                $(".type-api").show();
            }else{
                $(".type-api").remove();
                $(".type-h5").show();
            }
            if(that.isPC()){
                $("html").addClass("pc");
                $("#upload1,#upload2,#upload6").attr("accept","image/png,image/jpg,image/jpeg")
            }
            $("html").show();
        },
        //判断是否需要适配pc
        isPC:function(){
            var userAgent = navigator.userAgent.toLowerCase();
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
            that.eventBindPic(4);
            that.eventBindPic(6);
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
                if(that.return_url&&that.is_api!="1"){
                    window.location.replace(that.return_url);
                }else{
                    try{
                        var ua = navigator.userAgent.toLowerCase();
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
                }
            });
            $("#submit6").bind("click",function() {
                that.upload6();
            });
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
                $("#upload4").bind("change",function() {
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
                $("#upload"+index).bind("change",function() {
                    if(this.files.length&&this.files[0]){
                        that.ErrorTip.show("加载中",that.time2wait);
                    }else{
                        that.ErrorTip.show("请选择图片");
                        return;
                    }
                    var reader = new FileReader();
                    var file=this.files[0]
                    setTimeout(function(){
                        lrz(file, {width: 800}).then(function (rst) {
                            that.compress(rst.base64, index);
                        });
                    },10);
                });
            }
        },
        ajaxErrorFn: function(that,xhr,textStatus) {
            if(textStatus=="timeout"){
                that.ErrorTip.show("网络超时，请稍后再试", 3000);
            }else{
                that.ErrorTip.show("网络异常，请稍后再试", 3000);
            }
        },
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
                "cs":{url: "http://10.1.30.51:8000/idsafe-front/frontserver/4.2/api/"},
                "zs":{url:"https://idsafe-auth.udcredit.com/frontserver/4.2/api/"},
                "zs-a":{url:"https://idsafe-auth-a.udcredit.com/frontserver/4.2/api/"},
                "zs-b":{url:"https://idsafe-auth-b.udcredit.com/frontserver/4.2/api/"}
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
                    if(that.is_api){
                        if(index==6){
                            that.ErrorTip.show("请上传有效照片");
                        }else{
                            that.ErrorTip.show("请上传有效身份证件");
                        }
                    }else{
                        if(index==6){
                            that.ErrorTip.show("请拍摄有效照片");
                        }else{
                            that.ErrorTip.show("请拍摄有效身份证件");
                        }
                    }
                    that.clearInputFile(index);
                    return;
                }
                that.minPic[index] = cvs.toDataURL('image/jpeg');
                $(".uploadpic"+index).attr("src",that.minPic[index]);
                $(".uploadinfo" + index).hide();
                that.clearInputFile(index);
                setTimeout(function(){
                    that.ErrorTip.show("",1);
                },10);
             };

            //     var u = 640, //压缩率
            //         c = document.createElement("canvas"),
            //         h = l.width,
            //         f = l.height;
            //         if(h > f){
            //             h > u && (f *= u / h,h = u)
            //         }else{
            //             f > u && (h *= u / f,f = u)
            //         }
            //     c.width = u,
            //     c.height = u;
            //     var m = c.getContext("2d");
            //     m.drawImage(l, (u - h) / 2, (u - f) / 2, h, f);
            //     if(!that.isColorPhoto(m.getImageData(0, 0, u, u).data)){
            //         if(that.is_api){
            //             if(index==6){
            //                 that.ErrorTip.show("请上传有效照片");
            //             }else{
            //                 that.ErrorTip.show("请上传有效身份证件");
            //             }
            //         }else{
            //             if(index==6){
            //                 that.ErrorTip.show("请拍摄有效照片");
            //             }else{
            //                 that.ErrorTip.show("请拍摄有效身份证件");
            //             }
            //         }
            //         return;
            //     }
            //     $(".uploadinfo" + index).hide();
            //     m.clearRect(0, 0, u, u);
            //     m.translate(u / 2, u / 2);
            //     var a = h
            //       , o = f;
            //     switch (Orientation) {
            //         case 6:
            //             m.rotate(90 * Math.PI / 180);
            //             a = f;
            //             o = h;
            //             break;
            //         case 3:
            //             m.rotate(180 * Math.PI / 180);
            //             break;
            //         case 8:
            //             m.rotate(-90 * Math.PI / 180);
            //             a = f;
            //             o = h;
            //     }
            //     m.drawImage(l, -h / 2, -f / 2, h, f),
            //     m.restore();
            //     var _ = document.createElement("canvas");
            //     _.width = a,
            //     _.height = o;
            //     var bili=0.7;
            //     var p = _.getContext("2d");
            //     if(o>a*bili){
            //         _.height = a*bili;
            //         p.drawImage(m.canvas, (u - a) / 2, (u - o) / 2+(o-a*bili)/2, a, a*bili, 0, 0, a, a*bili);
            //     }else{
            //         p.drawImage(m.canvas, (u - a) / 2, (u - o) / 2, a, o, 0, 0, a, o);
            //     }
            //     $(".uploadpic"+index).attr("src",_.toDataURL("image/jpeg"));
            //     that.minPic[index] = _.toDataURL('image/jpeg');
            //     that.ErrorTip.show("",1);
            // }
        },
        //压缩视频
        compressv: function(res, e) {
            var that = this;
            if(e.total>that.maxvideosize*1024*1024){
                that.ErrorTip.show("当前视频"+(e.total/1024/1024).toFixed(2)+"MB，超过"+that.maxvideosize+"MB，请缩短拍摄时间或降低视频分辨率再上传")
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
        //h5简版获取package_session_id
        get_package_session_id: function() {
            var that = this;
            var postData = {
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                extension_info: that.extension_info,
                sign_time: that.sign_time,
                id_number:that.id_number,
                id_name:that.id_name
            }
            postData.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key);

            function successFn(data) {
                if (!data.result.success) {
                    that.ErrorTip.show(data.result.message || data.result.errorcode);
                } else {
                    that.package_session_id = data.data.package_session_id;
                    that.postGetValidate();
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "new_simpleauth_order/pub_key/" + that.apiConfig.pub_key + "/order_type/h5",
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
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                extension_info: that.extension_info,
                sign_time: that.sign_time,
                idcard_front_photo: that.minPic[1].substr(that.minPic[1].indexOf(",")+1,that.minPic[1].length-1)
            }
            if (that.savePostPic1[postData.idcard_front_photo]) {
                successFn(that.savePostPic1[postData.idcard_front_photo]);
                return;
            }
            postData.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key);

            function successFn(data) {
                // {"birthday":"1989.04.01","partner_order_id":"0001","id_number":"350427198904010016","address":"福屯省二省方怀马3海科村门锐2号","gender":"男","nation":"汉","package_session_id":"150097098267099136","age":"27","id_name":"蒋景汉"}
                that.savePostPic1[postData.idcard_front_photo] = data;
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
                    that.package_session_id = data.data.package_session_id;
                    that.ErrorTip.show("验证成功", 100);
                    that.showStep(2);
                }
                that.clearInputFile(1);
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "idcard_front_photo_ocr/pub_key/" + that.apiConfig.pub_key + (that.is_api?"":"/order_type/h5"),
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
                package_session_id: that.package_session_id,
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                extension_info: that.extension_info,
                sign_time: that.sign_time,
                idcard_back_photo: that.minPic[2].substr(that.minPic[2].indexOf(",")+1,that.minPic[2].length-1)
            }
            if (that.savePostPic2[postData.idcard_back_photo]) {
                successFn(that.savePostPic2[postData.idcard_back_photo]);
                return;
            }
            postData.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                //{"partner_order_id":"0001","idcard_back_photo":"20170208141512763934468.jpg","issuing_authority":"宁盘中卫市公安局沙坡头区局","validity_period":"2007.11.28-长期","package_session_id":"150138789514641409"}
                that.savePostPic2[postData.idcard_back_photo] = data;
                if (!data.result.success) {
                    that.ErrorTip.show((data.result.message || data.result.errorcode)+"<br>请点击证件图片重新拍摄");

                    // if(data.result.errorcode=="410006"){
                    //     that.ErrorTip.show("身份证已过期，请更换证件");
                    // }else{
                    //     that.ErrorTip.show("验证失败：网络异常");
                    // }
                } else {
                    that.saveInfo.time = data.data.validity_period;
                    that.package_session_id = data.data.package_session_id;
                    that.ErrorTip.show("验证成功", 100);
                    that.showStep(3);
                    $("#cname").val(that.saveInfo.name);
                    $("#ccard").text(that.saveInfo.cardshow);
                    $("#ctime").text(that.saveInfo.time);
                }
                that.clearInputFile(2);
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "idcard_back_photo_ocr/pub_key/" + that.apiConfig.pub_key + (that.is_api?"":"/order_type/h5"),
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
        //api:OCR识别结果更新接口，修改姓名提交
        upload3: function() {
            var that = this;
            var name=$.trim($("#cname").val());
            var namePattern = new RegExp("^([\u4e00-\u9fa5\u3400-\u4db5]+(·[\u4e00-\u9fa5\u3400-\u4db5]+)*)$");
            if(!that.package_session_id){
                that.ErrorTip.show("请按顺序进行验证");
            }else if (!name) {
                that.ErrorTip.show("请输入身份证姓名");
            }else if (name.length<2) {
                that.ErrorTip.show("姓名格式错误，请重新输入");
            }else if (!namePattern.test(name)) {
                that.ErrorTip.show("姓名格式错误，请重新输入");
            }else if (that.saveInfo.name == $.trim($("#cname").val())) {
                if(that.is_api=="1"){
                    that.showStep(6);
                }else{
                    that.postGetValidate();
                }
            } else {
                that.ErrorTip.show("正在修改姓名，请稍候", that.time2wait);
                var postData = {
                    package_session_id: that.package_session_id,
                    partner_order_id: that.partner_order_id,
                    sign_time: that.sign_time,
                    id_name: $.trim($("#cname").val())
                }
                postData.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

                function successFn(data) {
                    that.savePostPic2[postData.idcard_back_photo] = data;
                    if (!data.result.success) {
                        that.ErrorTip.show(data.result.message || data.result.errorcode);
                    } else {
                        that.ErrorTip.show("姓名修改成功", 100);
                        that.package_session_id = data.data.package_session_id;
                        if(that.is_api=="1"){
                            that.showStep(6);
                        }else{
                            that.postGetValidate();
                        }

                    }
                }
                $.ajax({
                    type: "POST",
                    url: that.apiConfig.url + "update_ocr_info/pub_key/" + that.apiConfig.pub_key + (that.is_api?"":"/order_type/h5"),
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
                package_session_id: that.package_session_id,
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                sign_time: that.sign_time
            }
            postData.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                //{"partner_order_id":"0001","living_validate_data":"0962","package_session_id":"154606505226665984"}
                if (!data.result.success) {
                    that.ErrorTip.show(data.result.message || data.result.errorcode);
                } else {
                    that.ErrorTip.show("验证码获取成功", 100);
                    that.package_session_id = data.data.package_session_id;
                    $(".take-num").text(data.data.living_validate_data);
                    if(that.isOutOfTime()){
                        $("#upload4").hide();
                    }
                    that.showStep(4);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "get_living_validate_data/pub_key/" + that.apiConfig.pub_key + "/order_type/h5",
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
        //api:活体检测接口
        upload4: function() {
            var that = this;
            if(!that.package_session_id){
                that.ErrorTip.show("请按顺序进行验证");
            // } else if(that.getInfo(that.saveHuotiName)&&that.getInfo(that.saveHuotiName).split(",").indexOf(that.apiConfig.pub_key+"{{#}}"+that.saveInfo.card)>=0){
            //     that.ErrorTip.show("已存在认证通过的记录，请勿重复认证");
            } else if(that.isOutOfTime()){
                that.ErrorTip.show("人脸认证失败次数过多，请退出重新操作。");
            } else if(!that.minVid){
                that.ErrorTip.show("人脸认证失败次数过多，请退出重新操作。");
            }else{
                that.ErrorTip.show("人脸认证中，请稍候", that.time2wait);
                that.addOutOfTime();
                if(that.isOutOfTime()){
                    $("#upload4").hide();
                }
                var postData = {
                    package_session_id: that.package_session_id,
                    package_code: that.package_code,
                    partner_order_id: that.partner_order_id,
                    extension_info: that.extension_info,
                    sign_time: that.sign_time,
                    living_video: that.minVid.substr(that.minVid.indexOf(",")+1,that.minVid.length-1)
                }
                postData.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

                function successFn(data) {
                    if (!data.result.success) {
                        that.ErrorTip.show(data.result.message || data.result.errorcode,2000);
                        setTimeout(function(){
                            that.postGetValidate();
                        },2000);
                    } else {
                        that.package_session_id = data.data.package_session_id;
                        that.return_photo = data.data.living_photo;
                        that.compare();
                    }
                }
                $.ajax({
                    type: "POST",
                    url: that.apiConfig.url + "living_detection/pub_key/" + that.apiConfig.pub_key + "/order_type/h5",
                    timeout:that.timeoutTime*3,
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
        //api:上传图片认证
        upload6: function() {
            var that = this;
            if (!that.minPic[6]) {
                that.ErrorTip.show("请上传正面照");
                return;
            }
            that.ErrorTip.show("正在验证，请稍候", that.time2wait);
            var postData = {
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                extension_info: that.extension_info,
                sign_time: that.sign_time,
                living_photo: that.minPic[6].substr(that.minPic[6].indexOf(",")+1,that.minPic[6].length-1)
            }
            var _url="";
            if(that.jianban){
                _url="single_idcard_verify_and_compare";
                postData.id_number=that.saveInfo.card||that.id_number;
                postData.id_name=that.saveInfo.name||that.id_name;
            }else{
                _url="idcard_verify_and_compare";
                postData.package_session_id=that.package_session_id;
            }
            if (that.savePostPic6[postData.living_photo]) {
                successFn(that.savePostPic6[postData.living_photo]);
                return;
            }
            postData.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key);

            function successFn(data) {
                that.savePostPic6[postData.idcard_front_photo] = data;
                if (!data.result.success) {
                    that.ErrorTip.show(data.result.message || data.result.errorcode);
                } else {
                    that.ErrorTip.show("验证完成",100);
                    if(!data.data){
                        data.data={};
                    }
                    that.setEndShow(data.data.auth_result,data.data.similarity);
                    that.showStep(5);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + _url + "/pub_key/"+ that.apiConfig.pub_key ,
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
        //api:身份验证、人像比对组合接口
        compare: function() {
            var that = this;
            that.ErrorTip.show("认证处理中，请稍候", that.time2wait);
            var postData = {
                package_session_id: that.package_session_id,
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                extension_info: that.extension_info,
                sign_time: that.sign_time,
                living_photo: that.return_photo
            }
            postData.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                // "500006", "查询不到身份信息"
                // "500007", "姓名和身份证号不一致"
                // "500014", "姓名和身份证号一致，查询不到照片"
                if (!data.result.success&&["500006","500007","500014"].indexOf(data.result.errorcode+"")<0) {
                    that.ErrorTip.show(data.result.message || data.result.errorcode,2000);
                    setTimeout(function(){
                        that.postGetValidate();
                    },2000);
                } else {
                    that.ErrorTip.show("验证完成",100);
                    if(!data.data){
                        data.data={};
                    }
                    that.setEndShow(data.data.auth_result,data.data.similarity);
                    if(data.data.auth_result=="T"){
                        that.setInfo(that.saveHuotiName,(that.getInfo(that.saveHuotiName)||"")+(that.apiConfig.pub_key+"{{#}}"+that.saveInfo.card)+",");
                    }
                    if(that.callback_url){
                        $.get(that.callback_url
                            + (that.callback_url.indexOf("?")>-1?"&":"?")
                            + "partner_order_id="+that.partner_order_id
                            + "&be_idcard="+data.data.similarity
                            + "&result_auth="+data.data.auth_result
                            + "&ret_code="+data.data.errorcode
                            + "&ret_msg="+data.data.message);
                    }
                    that.showStep(5);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "idcard_verify_and_compare/pub_key/" + that.apiConfig.pub_key + "/order_type/h5",
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
        isOutOfTime:function(){
            var that = this;
            var htcsList=(that.getInfo(that.saveHuotiCS)||"").split("{{htcs}}");
            if(htcsList.length==2&&that.partner_order_id==htcsList[0]&&htcsList[1]-that.reTestTime>=0){
                return true;
            }
            return false;
        },
        addOutOfTime:function(){
            var that = this;
            var htcsList=(that.getInfo(that.saveHuotiCS)||"").split("{{htcs}}");
            if(htcsList.length==2&&that.partner_order_id==htcsList[0]){
                htcsList[1]=(+htcsList[1])+1;
                that.setInfo(that.saveHuotiCS,htcsList[0]+"{{htcs}}"+htcsList[1]);
            }else{
                that.setInfo(that.saveHuotiCS,that.partner_order_id+"{{htcs}}1");
            }
        },
        setEndShow:function (auth_result,similarity) {
            if(similarity){
                similarity=(+similarity).toFixed(2);
            }else{
                similarity=0;
            }
            if(!auth_result){
                auth_result="F";
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
            $("#suinfo_info").text({T:"认证通过",F:"认证未通过",C:"审核中"}[auth_result]);
            $(".suinfo-pan").hide();
            $("#suinfo_"+auth_result).show();
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
