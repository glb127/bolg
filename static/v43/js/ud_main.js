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
        var decryptedData = "";
        try{
          decryptedData=CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(key), {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
          }).toString(CryptoJS.enc.Utf8);
        }catch(e){}
        if(!decryptedData){
          try{
            decryptedData=CryptoJS.AES.decrypt(str, CryptoJS.enc.Utf8.parse(key.replace(/-/g,"")), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8);
          }catch(e){}
        }
        Request = (function () {
            var strs = decryptedData.split("&");
            var theRequest = new Object();
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].substr(strs[i].indexOf("=")+1));
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

        saveLog: {}, //日志

        //初始化
        init: function() {
            var that = this;
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

            that.mylog(1,"h5init",that.getUAinfo());
            that.mylog(1,"h5url",location.href);
            that.mylog(1,"h5request",Request);
            if(!that.apiConfig.pub_key){
              that.ErrorTip.show("参数缺失");
              that.mylog(1,"request_error",{msg:"no pub_key"});
            }

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
                        "errMsg": errMsg,
                        "scriptURI": scriptURI,
                        "lineNumber": lineNumber,
                        "columnNumber": columnNumber,
                        "errorObj": errorObj
                    };
                    if(location.host!="static.udcredit.com"){
                        alert(JSON.stringify(rst));
                    }
                    that.mylog(3,"error",rst);
                    that.postAllLog();
                    that.ErrorTip.show("网络异常，请稍后再试",that.time2wait);
                    setTimeout(function(){
                        location.reload();
                    },2000);
                });
                return false;
            };
            window.onbeforeunload = function() {
                that.mylog(3,"close",{msg:"close"});
                that.postAllLog();
            };
        },
        //环境
        apiConfig:function(){
            var that = this;
            var apiConfigMap={
                "cs":{
                  url: "http://10.1.30.51:8000/idsafe-front/front/4.3/api/",
                  logurl: "http://10.1.30.51:8000/las-front/las/4.3/log/post_log/processor/idsafe_h5_front",
                },
                "cs2":{
                  url: "http://10.1.30.51:8080/idsafe-front/front/4.3/api/",
                  logurl: "http://10.1.30.51:8080/las-front/las/4.3/log/post_log/processor/idsafe_h5_front",
                },
                "zs":{
                  url:"https://idsafe-auth.udcredit.com/front/4.3/api/",
                  logurl: "/front/las/4.3/log/post_log/processor/idsafe_h5_front",
                },
                "zs-a":{
                  url:"https://idsafe-auth-a.udcredit.com/front/4.3/api/",
                  logurl: "/front/las/4.3/log/post_log/processor/idsafe_h5_front",
                },
                "zs-b":{
                  url:"https://idsafe-auth-b.udcredit.com/front/4.3/api/",
                  logurl: "/front/las/4.3/log/post_log/processor/idsafe_h5_front",
                }
            };
            var retObj = apiConfigMap[that.url_type]?apiConfigMap[that.url_type]:apiConfigMap["zs"];
            if(that.pub_key){
                retObj.pub_key=that.pub_key;
                delete retObj.security_key;
            }
            if(location.hostname=="10.10.1.95"||location.hostname=="localhost"){
              retObj.logurl="/front/las/4.3/log/post_log/processor/idsafe_h5_front";
            }
            return retObj;
        },
        getUAinfo:function(){
          /*{ua: "",browser: {name: "",version: ""},engine: {name: "",version: ""},os: {name: "",version: ""},device: {model: "",type: "",vendor: ""},cpu: {architecture: ""}}*/
          var result = {};
          try{
              result = new UAParser().getResult();
          }catch(e){}
          return result;
        },
        mylog:function (type,action,content) {
          // init
          // check
          // picinfo
          // choosepic
          // post
          // post_error
          // result
          var that=this;
          var _map={
            1:"sdk_ocr_front",
            2:"sdk_ocr_back",
            3:"sdk_ocr_manual",
            4:"h5v43_hack_check",
          };
          if(!that.saveLog[_map[type]]){
            that.saveLog[_map[type]]=[];
          }
          that.saveLog[_map[type]].push({
            "action": action,
            "log_level": "info",
            "log_content": content,
            "log_time": +new Date(),
          })
        },
        postAllLog:function () {
          var that=this;
          for(var ent in that.saveLog){
            that.postLog(that,ent,that.saveLog[ent]);
          }
          that.saveLog={}
        },
        postLog:function (that,stage,body) {
          if(!body||!body.length){return;}
          var _newDate=+new Date()
          var postData = {
              "header": {
                  "log_id": "h5_"+that.sign_time,
                  "pub_key":that.apiConfig.pub_key,
                  "partner_order_id":that.partner_order_id,
                  "platform": "h5",
                  "stage":stage,
                  "upload_time": _newDate,
                  "sign": "",
                  "sign_time": that.sign_time,
                  "session_id": that.session_id,
                  // "device_band":"glb",
              },
              "body": body
          }
          postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key);

          $.ajax({
              type: "POST",
              url: that.apiConfig.logurl+"?partner_order_id="+that.partner_order_id+"&stage="+stage ,//http://10.1.30.51:8000/
              timeout:that.timeoutTime,
              data: JSON.stringify(postData),
              dataType: "json",
              headers: {
                  'Content-Type': 'application/json'
              },
          });
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
            that.eventBindPic(6);
            that.eventBindPic(4);
            $("#submit1").bind("click",function() {
                that.mylog(1,"check",{msg:"btn_1"});
                that.upload1();
            });
            $("#submit2").bind("click",function() {
                that.mylog(2,"check",{msg:"btn_2"});
                that.upload2();
            });
            $("#submit3").bind("click",function() {
                that.mylog(3,"check",{msg:"btn_3"});
                that.upload3();
            });
            $("#submit4").bind("click",function() {
                that.mylog(3,"check",{msg:"btn_4"});
                that.upload4();
            });
            $("#cname_edit").bind("click",function() {
                that.mylog(3,"check",{msg:"btn_edit"});
                $("#cname").focus();
            });
            $("#submit5").bind("click",function() {
                that.mylog(3,"check",{msg:"btn_5"});
                that.closeWindow();
            });
            $("#submit6").bind("click",function() {
                that.mylog(3,"check",{msg:"btn_6"});
                that.upload6();
            });
            $("#isagreement1").bind("change",function() {
                that.mylog(1,"check",{msg:"agreement1",checked:($("#isagreement1:checked").length?"y":"n")});
            });
            $("#isagreement2").bind("change",function() {
                that.mylog(3,"check",{msg:"agreement2",checked:($("#isagreement2:checked").length?"y":"n")});
            });
            $("#isagreement3").bind("change",function() {
                that.mylog(3,"check",{msg:"agreement3",checked:($("#isagreement3:checked").length?"y":"n")});
            });
            $("#agreement1_show").bind("click",function() {
                that.mylog(1,"check",{msg:"go_agreement1"});
            });
            $("#agreement2_show").bind("click",function() {
                that.mylog(3,"check",{msg:"go_agreement2"});
            });
            $("#agreement3_show").bind("click",function() {
                that.mylog(3,"check",{msg:"go_agreement3"});
            });
        },
        closeWindow: function(){
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
            window.history.go(-1)
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
                $("#upload"+index).bind("change",function() {
                    that.mylog(index>2?3:index,"check",{msg:"pic_"+index});
                    if(this.files.length&&this.files[0]){
                        that.ErrorTip.show("加载中",that.time2wait);
                    }else{
                        that.ErrorTip.show("请选择图片");
                        return;
                    }
                    var file=this.files[0];
                    var img=new Image();
                    var blob = URL.createObjectURL(file);
                    img.onerror = function(a1) {
                        if(index==1||index==2){
                            that.ErrorTip.show("照片拍摄失败，请升级手机系统或微信右上角选择在浏览器中打开");
                        }else{
                            that.ErrorTip.show("该手机系统版本前置拍摄存在异常，请切换后置摄像头拍摄");
                        }

                    }
                    img.onload= function(a1) {
                      var img_w="";
                      var img_h="";
                      try{
                        img_w=a1.currentTarget.width;
                        img_h=a1.currentTarget.height;
                      }catch(e){}

                      lrz(file, {width: 800}).then(function (rst) {
                          try{
                            delete rst.origin.exifdata.undefined;
                            for(var ent in rst.origin.exifdata){
                              rst.origin.exifdata[ent]=rst.origin.exifdata[ent].replace(/\u0000/g," ")
                            }
                          }catch(e){}
                          try{
                            that.mylog(index>2?3:index,"pic_info",{msg:(rst&&rst.origin)?{
                              name:rst.origin.name,
                              size:rst.origin.size,
                              width:img_w,
                              height:img_h,
                              fileLen:rst.fileLen,
                              type:rst.origin.type,
                              lastModified:rst.origin.lastModified,
                              lastModifiedDate:rst.origin.lastModifiedDate,
                            }:{}});
                            that.mylog(index>2?3:index,"pic_exifdata",{msg:(rst&&rst.origin&&rst.origin.exifdata)?rst.origin.exifdata:{}});
                          }catch(e){}
                          that.compress(rst.base64, index);
                      });
                    }
                    img.src = blob;
                });
            }
        },
         //弹框
        ErrorTip: function () {
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
                if (!message) { return; }
                if(message.indexOf("签名过期")>=0){
                    message="操作超时，请重新认证";
                }
                if (obj) {
                    clearTimeout(time);
                    obj.stop();
                    obj.remove();
                    obj = "";
                }
                var deTime = message.length * 200 + 300;
                if (deTime > 15000) { deTime = 15000; }
                obj = $(dom.replace("{{message}}", message)).appendTo("body");
                obj.click(function(e) {
                    if (obj && obj.fadeOut) {
                        clearTimeout(time);
                        obj.stop();
                        obj.remove();
                        obj = "";
                    }
                })
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
                    that.mylog(index>2?3:index,"pic_nocolor",{msg:"pic_"+index});
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
                that.clearInputFile(index);
                $(".uploadinfo" + index).hide();
                setTimeout(function(){
                    that.ErrorTip.hide();
                },10);
             };
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
            var that=this;
            $(".step").hide();
            $("#step"+index).show();

            if(index=="1"){
                that.mylog(1,"init",{msg:"into_1"});
                $("title").html("添加身份证信息");
                $(".top-1,.top-2").show();
                $(".active").removeClass("active");
                $(".top-step1").addClass("active");
            }else if(index=="2"){
                that.mylog(2,"init",{msg:"into_2"});
                $("title").html("添加身份证信息");
                $(".top-1,.top-2").show();
                $(".active").removeClass("active");
                $(".top-step1,.top-step2").addClass("active");
            }else if(index=="3"){
                that.mylog(3,"init",{msg:"into_3"});
                $("title").html("确认信息");
                $(".top-1,.top-2").show();
                $(".active").removeClass("active");
                $(".top-step1,.top-step2,.top-step3").addClass("active");
            }else if(index=="4"){
                $("title").html("验证身份");
                $(".top-1,.top-2").hide();
            }else if(index=="5"){
                that.mylog(3,"init",{msg:"into_5"});
                $("title").html("认证结果");
                $(".top-1,.top-2").hide();
            }else if(index=="6"){
                that.mylog(3,"init",{msg:"into_4"});
                $("title").html("上传正面照");
                $(".top-1,.top-2").hide();
            }
        },
        //ajax错误
        ajaxErrorFn: function(that,xhr,textStatus) {
            that.mylog(3,"post_error",{xhr:xhr,textStatus:textStatus});
            that.postAllLog();
            if(textStatus=="timeout"){
                that.ErrorTip.show("网络超时，请稍后再试", 3000);
            }else{
                that.ErrorTip.show("网络异常，请稍后再试", 3000);
            }
        },
        //api:身份证正面OCR识别接口
        upload1: function() {
            var that = this;
            if(!that.apiConfig.pub_key){
              that.ErrorTip.show("参数缺失");
              return;
            }
            if($("#agreement1").css("display")!="none"&&$("#isagreement1:checked").length==0){
                that.ErrorTip.show("请您先阅读并勾选<br>《用户协议》");
                return;
            }
            if (!that.minPic[1]) {
                that.ErrorTip.show("请上传身份证人像面图片");
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
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key);

            var check_postData= $.extend(true, {}, postData);
            check_postData.body.idcard_photo=check_postData.body.idcard_front_photo;
            delete check_postData.body.idcard_front_photo;

            if (that.savePostPic1[postData.body.idcard_front_photo]) {
                successFn(that.savePostPic1[postData.body.idcard_front_photo]);
                return;
            }
            function successFn(data) {
                that.mylog(1,"post",{msg:"idcard_front_photo_ocr"});
                that.postAllLog();
                that.savePostPic1[postData.body.idcard_front_photo] = data;
                if (!data.result.success) {
                    that.ErrorTip.show(("["+data.result.errorcode+"]"+data.result.message )+"<br>请点击证件图片重新拍摄");
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
            function post(){
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
            }
            function check_successFn(data) {
                that.mylog(1,"post",{msg:"idcard_quality_check",data:data});
                that.postAllLog();
                var lanjie=false;
                try{
                  if(data.data.incomplete>0.5||data.data.blurry>0.5){
                    lanjie=true;
                  }
                }catch(e){}
                if(lanjie){
                    that.ErrorTip.show("身份证检测未通过<br>请点击证件图片重新拍摄");
                    that.clearInputFile(1);
                }else{
                    post();
                }
            }
            function chexk(){
                $.ajax({
                    type: "POST",
                    url: that.apiConfig.url + "idcard_quality_check/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                    timeout:that.timeoutTime,
                    data: JSON.stringify(check_postData),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: check_successFn,
                    error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
                });
            }
            chexk()

        },
        //api:身份证反面OCR识别接口
        upload2: function() {
            var that = this;
            if (!that.minPic[2]) {
                that.ErrorTip.show("请上传身份证国徽面图片");
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
                    "idcard_back_photo": that.minPic[2].substr(that.minPic[2].indexOf(",")+1,that.minPic[2].length-1)
                }
            }
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)
            var check_postData= $.extend(true, {}, postData);
            check_postData.body.idcard_photo=check_postData.body.idcard_back_photo;
            delete check_postData.body.idcard_back_photo;

            if (that.savePostPic2[postData.body.idcard_back_photo]) {
                successFn(that.savePostPic2[postData.body.idcard_back_photo]);
                return;
            }
            function successFn(data) {
                that.mylog(2,"post",{msg:"idcard_back_photo_ocr"});
                that.postAllLog();
                //{"partner_order_id":"0001","idcard_back_photo":"20170208141512763934468.jpg","issuing_authority":"宁盘中卫市公安局沙坡头区局","validity_period":"2007.11.28-长期","session_id":"150138789514641409"}
                that.savePostPic2[postData.body.idcard_back_photo] = data;
                if (!data.result.success) {
                    that.ErrorTip.show(("["+data.result.errorcode+"]"+data.result.message )+"<br>请点击证件图片重新拍摄");
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
            function post(){
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
            }

            function check_successFn(data) {
                that.mylog(1,"post",{msg:"idcard_quality_check",data:data});
                that.postAllLog();
                var lanjie=false;
                try{
                  if(data.data.incomplete>0.5||data.data.blurry>0.5){
                    lanjie=true;
                  }
                }catch(e){}
                if(lanjie){
                    that.ErrorTip.show("身份证检测未通过<br>请点击证件图片重新拍摄");
                    that.clearInputFile(1);
                }else{
                    post();
                }
            }
            function chexk(){
                $.ajax({
                    type: "POST",
                    url: that.apiConfig.url + "idcard_quality_check/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                    timeout:that.timeoutTime,
                    data: JSON.stringify(check_postData),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: check_successFn,
                    error:function(xhr,status){ that.ajaxErrorFn(that,xhr,status);},
                });
            }
            chexk()
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
                    that.mylog(3,"post",{msg:"update_ocr_info",data:data});
                    that.postAllLog();
                    if (!data.result.success) {
                        that.ErrorTip.show("["+data.result.errorcode+"]"+data.result.message );
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
                that.mylog(3,"post",{msg:"get_living_validate_data",data:data});
                that.postAllLog();
                if (!data.result.success) {
                    that.ErrorTip.show("["+data.result.errorcode+"]"+data.result.message );
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
                that.ErrorTip.show("请上传本人正面照片");
                that.clearInputFile(6);
            }else{
                // that.h5_check();
                that.api_hake();
            }

        },
        //h5-api:身份验证接口
        h5_check: function() {
            var that = this;
            that.h5_checkcompare();
            return;
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
                that.mylog(3,"post",{msg:"idcard_verify",data:data});
                that.postAllLog();
                if(data&&data.result&&data.result.errorcode=="100002"){
                    that.h5_checkcompare();
                    return;
                }
                // "500006", "查询不到身份信息"
                // "500007", "姓名和身份证号不一致"
                // "500014", "姓名和身份证号一致，查询不到照片"
                // 0-姓名与号码一致，但无网格照；
                // 1-姓名与号码一致；
                // 2-姓名与号码不一致；
                // 3-查询无结果；
                if (!data.result.success) {
                    that.pushCallback("F","0",data.result.errorcode||"999999",data.result.message||"系统异常");
                } else if(data.data.verify_status+""=="0"){
                    that.pushCallback("F","0","500014","姓名和身份证号码一致，但查询不到照片");
                } else if(data.data.verify_status+""=="2"){
                    that.pushCallback("F","0","500007","姓名和身份证号码不一致");
                } else if(data.data.verify_status+""=="3"){
                    that.pushCallback("F","0","500006","姓名和身份证号查询无结果");
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
                    that.mylog(3,"post",{msg:"living_detection",data:data});
                    that.postAllLog();
                    if (!data.result.success) {
                        that.pushCallback("F","0",data.result.errorcode||"999999",data.result.message||"系统异常");
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
                that.mylog(3,"post",{msg:"face_compare",data:data});
                that.postAllLog();
                // "500006", "查询不到身份信息"
                // "500007", "姓名和身份证号不一致"
                // "500014", "姓名和身份证号一致，查询不到照片"
                if (!data.result.success) {
                    // that.ErrorTip.show(data.result.message || data.result.errorcode,2000);
                    // setTimeout(function(){
                    //     that.postGetValidate();
                    // },2000);
                    that.pushCallback("F","0",data.result.errorcode||"999999",data.result.message||"系统异常");
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
                    if(data.data.suggest_result){
                        data.data.auth_result=data.data.suggest_result
                    }
                    that.pushCallback(data.data.auth_result,data.data.similarity,"","",thresholds,that.living_attack);
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
                that.mylog(3,"post",{msg:"face_compare",data:data});
                that.postAllLog();
                if (!data.result.success) {
                    // that.ErrorTip.show(data.result.message || data.result.errorcode,2000);
                    that.pushCallback("F","0",data.result.errorcode||"999999",data.result.message||"系统异常");
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
                    if(data.data.suggest_result){
                        data.data.auth_result=data.data.suggest_result
                    }
                    that.pushCallback(data.data.auth_result,data.data.similarity,"","",thresholds);
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
        //api:防骇客
        api_hake: function() {
          // 侧脸{score: "-1", isHack: "unkonw"}
          // 无人脸 {score: "-1", isHack: "unkonw"}
          // 骇客攻击 {score: "0.9999985694885254", isHack: "true"}
          // 正常 {score: "0.3339357376098633", isHack: "false"}
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
                    "living_photo":  that.minPic[6].substr(that.minPic[6].indexOf(",")+1,that.minPic[6].length-1)
                }
            }
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                that.mylog(3,"post",{msg:"hack_detecting",data:data});
                if(data.data&&data.data.living_photo_name){
                  that.mylog(3,"hack_pic",data.data.living_photo_name);
                }
                if (!data.result.success) {
                    if(data.result.errorcode=="999999"){
                        that.h5_check();
                        // that.ErrorTip.show("照片检测未通过，请重新拍摄");
                    }else{
                        that.mylog(3,"hack_error",{msg:"stop2"});
                        that.mylog(4,"hack_pic",data.data.living_photo_name);
                        that.ErrorTip.show("["+data.result.errorcode+"]"+data.result.message );
                    }
                }else if(data.data.isHack=="false"){
                    that.h5_check();
                }else{
                    that.mylog(3,"hack_error",{msg:"stop"});
                    that.mylog(4,"hack_pic",data.data.living_photo_name);
                    that.ErrorTip.show("照片检测未通过，请重新拍摄");
                }
                that.postAllLog();
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "hack_detecting/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
                data: JSON.stringify(postData),
                timeout:that.timeoutTime,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn,
                error:function(xhr,status){ that.h5_check();},
            });
        },
        //h5-api:身份验证+人脸比对接口
        h5_checkcompare: function() {
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
                    photo:{
                        img_file_source:2,
                        img_file: that.minPic[6].substr(that.minPic[6].indexOf(",")+1,that.minPic[6].length-1)
                    }
                }
            }
            postData.header.sign = that.sign || hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + that.partner_order_id + "|sign_time=" + that.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                that.mylog(3,"post",{msg:"verify_and_compare",data:data});
                that.postAllLog();
                if (!data.result.success) {
                    // that.ErrorTip.show(data.result.message || data.result.errorcode,2000);
                    that.pushCallback("F","",data.result.errorcode||"999999",data.result.message||"系统异常");
                } else {
                    that.ErrorTip.show("验证完成",100);
                    if(!data.data){
                        data.data={};
                    }
                    that.pushCallback(data.data.suggest_result,"","","","","",data.data.result_status);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "verify_and_compare/pub_key/" + that.apiConfig.pub_key + "/platform/h5",
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

        setEndShow:function (auth_result,similarity,code,msg) {
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
            if(code){
                $("#error-meg").text("["+code+"]"+msg);
            }else{
                $("#error-meg").text("");
            }
            that.ErrorTip.show("验证完成",10);

        },
        pushCallback:function (auth_result,similarity,code,msg,thresholds,living_attack,result_status) {
            var that=this;
            if(that.callback_url){
                var url=that.callback_url
                    + (that.callback_url.indexOf("?")>-1?"&":"?")
                    + "partner_order_id="+that.partner_order_id
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
                if(similarity){
                    url+="&similarity="+similarity;
                }
                if(result_status){
                    url+="&result_status="+result_status;
                }

                that.mylog(3,"result",{msg:"post",data:url});
                that.postAllLog();
                $.get(url);
            }
            if(that.return_url){
                var url=that.return_url
                    + (that.callback_url.indexOf("?")>-1?"&":"?")
                    + "partner_order_id="+that.partner_order_id
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
                if(similarity){
                    url+="&similarity="+similarity;
                }
                if(result_status){
                    url+="&result_status="+result_status;
                }
                that.mylog(3,"result",{msg:"open",data:url});
                that.postAllLog();
                setTimeout(function(){
                    window.location.replace(url);
                },1000);

            }else{
                that.mylog(3,"result",{msg:"show",data:{
                    auth_result:auth_result,
                    similarity:similarity,
                    code:code,
                    msg:msg,
                    thresholds:thresholds,
                    living_attack:living_attack,
                    result_status:result_status
                }});
                that.postAllLog();
                // that.closeWindow();
                that.setEndShow(auth_result,similarity,code,msg);
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
