// (function() {
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
    }
    var Request = (function () {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    })();
    //主函数
    var h5_upload = {
/********** 商户信息 **********/
// +:%2B 空:%20 /:%2F ?:%3F %:%25 #:%23 &:%26 =:%3D
        step_num: Request["step_num"]||"11", //第几步，可用于查看按钮背景色改变后效果（1：身份证正反面页面，2：修改姓名页面，3：上传视频页面，4：结果页面）
        url_type: Request["url_type"]||"cs", //商户订单号，测试时默认cs，上线时默认zs（cs：测试，zs：正式，zs-a：正式a，zs-b：正式b）
        partner_order_id: Request["partner_order_id"]||(+new Date()), //商户订单号  测试时默认时间戳
        package_code: Request["package_code"]||"", //套餐代码
        extension_info: Request["extension_info"]||"", //扩展信息
        btn_color:Request["btn_color"]||"#12addd", //按钮颜色，格式为url('。。。') 或 #333 或 red
        finally_color:Request["finally_color"]||"url('./images/blueback.png')", //结果页背景颜色，格式为url('。。。') 或 #333 或 red

/********** 常量 **********/
        time2wait : 600*1000,
        time2long : 600*1000,

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
            time: ""
        }, //保存正反面照需要信息
        return_photo: "",//优图返回图片
        package_session_id: "", //套餐会话ID


        //初始化
        init: function() {
            var that = this;
            that.apiConfig = that.apiConfig();
            that.ErrorTip = that.ErrorTip();
            that.initColor();
            that.eventBind();
            that.showStep(that.step_num);
            that.takePhoto();
        },
        //渲染颜色
        initColor: function () {
            var that = this;
            $(".submit-btn").css("background",that.btn_color);
            $("#step4").css({"background":that.finally_color,"background-size":"100% 100%"});
        },
        //拍照
        takePhoto: function(){
            var videoObj={'video': true};
            //获取要控制的DOM对象
            var canvas=document.getElementById('canvas_show'),//createElement
                context=canvas.getContext('2d'),
                video=document.getElementById('video_show'),
                errBack=function(error){
                    console.log('video capture error:',error.code);
                }
            navigator.myGetUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;
            navigator.myGetUserMedia(videoObj,function(localMediaStream){
                window.URL=window.URL||window.webkitURL||window.mozURL||window.msURL;
                video.src=window.URL.createObjectURL(localMediaStream);
                video.play();
            },errBack);
            video.onloadedmetadata=function(e){
                window.setInterval(function(){
                    context.drawImage(video, 0, 0, 375, 180);
                },15);
                $('#snap_in').click(function(){
                    context.drawImage(video,0,0,video.videoWidth, video.videoHeight);
                    console.log(canvas.toDataURL('image/jpeg', 1))
                })
            };
        },
        //绑定按键
        eventBind: function() {
            var that = this;
            var timeout1,timeout2;
            $("#uploadpic1").click(function(){
                var count=0;
                $("#uploaddemo1").show();
                timeout1=setTimeout(function () {
                    $("#upload1").click();
                    $("#uploaddemo1").hide();
                },1000);
            });
            $("#uploaddemo1").click(function(){
                clearTimeout(timeout1);
                $("#upload1").click();
                $("#uploaddemo1").hide();
            });
            $("#upload1").change(function() {
                var reader = new FileReader();
                reader.onload = function(e) {
                    that.compress(this.result, 1);
                };
                reader.readAsDataURL(this.files[0]);
            });

            $("#uploadpic2").click(function(){
                $("#uploaddemo2").show();
                timeout2=setTimeout(function () {
                    $("#upload2").click();
                    $("#uploaddemo2").hide();
                },1000);
            });
            $("#uploaddemo2").click(function(){
                clearTimeout(timeout2);
                $("#upload2").click();
                $("#uploaddemo2").hide();
            });
            $("#upload2").change(function() {
                var reader = new FileReader();
                reader.onload = function(e) {
                    that.compress(this.result, 2);
                };
                reader.readAsDataURL(this.files[0]);
            });
            $("#upload3").change(function() {
                var reader = new FileReader();
                reader.onload = function(e) {
                    that.compressv(this.result);
                };
                reader.readAsDataURL(this.files[0]);
            });
            $("#submit1").click(function() {
                that.upload1();
            });
            $("#submit2").click(function() {
                that.upload2();
            });
            $("#cname_edit").click(function() {
                $("#cname").focus();
            })
            $("#submit4").click(function() {
                location.reload();
            });
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
            }
            function show(message, wait) {
                if (!message) {
                    return;
                }
                hide();
                obj = $(dom.replace("{{message}}", message)).appendTo("body");
                time = setTimeout(function() {
                    hide();
                }, wait||1500);
            }
            return {
                show: show,
                hide: hide
            };
        },
        //环境
        apiConfig:function(){
            var that = this;
            var apiConfigMap={
                "wg":{//王刚
                    url: "http://10.10.1.20:8080/idsafe-front/frontserver/4.2/api/",
                    pub_key: "4ad2c7c4-f9fa-456b-92cd-056d5e5bcd59",
                    security_key: "2e6b6da8-77b9-4268-a8ba-8ff47ca7e6b6",
                },
                "cs":{//测试
                    url: "http://10.20.107.145:8000/idsafe-front/frontserver/4.2/api/",
                    pub_key: "4ad2c7c4-f9fa-456b-92cd-056d5e5bcd59",
                    security_key: "2e6b6da8-77b9-4268-a8ba-8ff47ca7e6b6",
                },
                "zs":{//正式
                    url:"https://idsafe-auth.udcredit.com/frontserver/4.2/api/",
                    pub_key:"6b1ae3c6-dc99-426b-ad86-9a99929681dc",
                    security_key:"b2a73e13-82d6-4244-8d6b-347a29f2c3d4",
                },
                "zs-a":{//正式-a
                    url:"https://idsafe-auth-a.udcredit.com/frontserver/4.2/api/",
                    pub_key:"6b1ae3c6-dc99-426b-ad86-9a99929681dc",
                    security_key:"b2a73e13-82d6-4244-8d6b-347a29f2c3d4",
                },
                "zs-b":{//正式-b
                    url:"https://idsafe-auth-b.udcredit.com/frontserver/4.2/api/",
                    pub_key:"6b1ae3c6-dc99-426b-ad86-9a99929681dc",
                    security_key:"b2a73e13-82d6-4244-8d6b-347a29f2c3d4",
                },
            }
            return apiConfigMap[that.url_type]?apiConfigMap[that.url_type]:apiConfigMap["zs"];
        },


        //压缩图片
        compress: function(res, index) {
            var that = this,
                img = new Image(),
                maxH = 300;//压缩率
            $("#uploadpic" + index).attr("src", res);
            img.onload = function() {
                var cvs = document.createElement('canvas'),
                    ctx = cvs.getContext('2d');
                if(img.height>img.width){
                    maxH=maxH*img.height/img.width;
                }
                if (img.height > maxH) {
                    img.width *= maxH / img.height;
                    img.height = maxH;
                }
                cvs.width = img.width;
                cvs.height = img.height;
                ctx.clearRect(0, 0, cvs.width, cvs.height);
                ctx.drawImage(img, 0, 0, img.width, img.height);
                that.minPic[index] = cvs.toDataURL('image/jpeg', 1);
                //$("#uploadpic"+index).attr("src",cvs.toDataURL('image/jpeg', 1));
            };
            img.src = res;
        },
        //压缩视频
        compressv: function(res, index) {
            var that = this;
            that.minVid = res;
            that.upload3();
        },
        showStep:function(index) {
            $(".step").hide();
            $("#step"+index).show();
        },
        //提交按钮
        upload1: function() {
            var that = this;
            if (!that.minPic[1]) {
                that.ErrorTip.show("请上传身份证正面图片");
            } else if (!that.minPic[2]) {
                that.ErrorTip.show("请上传身份证反面图片");
            } else {
                that.postFrontPhoto()
            }
        },
        //api:身份证正面OCR识别接口
        postFrontPhoto: function() {
            var that = this;
            that.ErrorTip.show("正在验证身份证正面照，请等待。。。", that.time2wait);
            var postData = {
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                extension_info: that.extension_info,
                sign_time: (new Date()).format('yyyyMMddhhmmss'),
                idcard_front_photo: that.minPic[1].substr(that.minPic[1].indexOf(",")+1,that.minPic[1].length-1)
            }
            if (that.savePostPic1[postData.idcard_front_photo]) {
                successFn(that.savePostPic1[postData.idcard_front_photo]);
                return;
            }
            postData.sign = hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key);

            function successFn(data) {
                // {"birthday":"1989.04.01","partner_order_id":"0001","id_number":"350427198904010016","address":"福屯省二省方怀马3海科村门锐2号","gender":"男","nation":"汉","package_session_id":"150097098267099136","age":"27","id_name":"蒋景汉"}
                that.savePostPic1[postData.idcard_front_photo] = data;
                if (!data.result.success) {
                    that.ErrorTip.show("身份证正面照验证失败：" + data.result.message, 5000);
                } else {
                    that.saveInfo.name = data.data.id_name;
                    that.saveInfo.card = data.data.id_number;
                    that.package_session_id = data.data.package_session_id;
                    that.postBackPhoto();
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "idcard_front_photo_ocr/pub_key/" + that.apiConfig.pub_key + "/order_type/h5",
                data: JSON.stringify(postData),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn
            });
        },
        //api:身份证反面OCR识别接口
        postBackPhoto: function() {
            var that = this;
            that.ErrorTip.show("正在验证身份证反面照，请等待。。。", that.time2wait);
            var postData = {
                package_session_id: that.package_session_id,
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                extension_info: that.extension_info,
                sign_time: (new Date()).format('yyyyMMddhhmmss'),
                idcard_back_photo: that.minPic[2].substr(that.minPic[2].indexOf(",")+1,that.minPic[2].length-1)
            }
            if (that.savePostPic2[postData.idcard_back_photo]) {
                successFn(that.savePostPic2[postData.idcard_back_photo]);
                return;
            }
            postData.sign = hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                //{"partner_order_id":"0001","idcard_back_photo":"20170208141512763934468.jpg","issuing_authority":"宁盘中卫市公安局沙坡头区局","validity_period":"2007.11.28-长期","package_session_id":"150138789514641409"}
                that.savePostPic2[postData.idcard_back_photo] = data;
                if (!data.result.success) {
                    that.ErrorTip.show("身份证反面照验证失败：" + data.result.message, 5000);
                } else {
                    that.saveInfo.time = data.data.validity_period;
                    that.package_session_id = data.data.package_session_id;
                    that.ErrorTip.show("验证成功", 100);
                    that.showStep(2);
                    $("#cname").val(that.saveInfo.name);
                    $("#ccard").text(that.saveInfo.card);
                    $("#ctime").text(that.saveInfo.time);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "idcard_back_photo_ocr/pub_key/" + that.apiConfig.pub_key + "/order_type/h5",
                data: JSON.stringify(postData),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn
            });
        },
        //api:OCR识别结果更新接口，修改姓名提交
        upload2: function() {
            var that = this;
            var namePattern = new RegExp("^([\\u4e00-\\u9fa5\\u3400-\\u4db5]+(·[\\u4e00-\\u9fa5\\u3400-\\u4db5]+)*){2,}$");
            if(!that.package_session_id){
                that.ErrorTip.show("请按顺序进行验证");
                return;
            }else if (!$.trim($("#cname").val())) {
                that.ErrorTip.show("请输入身份证姓名");
                return;
            }else if (!namePattern.test($("#cname").val())) {
                that.ErrorTip.show("身份证姓名格式错误");
                return;
            }

            if (that.saveInfo.name == $.trim($("#cname").val())) {
                that.postGetValidate();
            } else {
                that.ErrorTip.show("正在修改姓名信息，请等待。。。", that.time2wait);
                var postData = {
                    package_session_id: that.package_session_id,
                    partner_order_id: that.partner_order_id,
                    sign_time: (new Date()).format('yyyyMMddhhmmss'),
                    id_name: $.trim($("#cname").val())
                }
                postData.sign = hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

                function successFn(data) {
                    that.savePostPic2[postData.idcard_back_photo] = data;
                    if (!data.result.success) {
                        that.ErrorTip.show(data.result.message, 3000);
                    } else {
                        that.package_session_id = data.data.package_session_id;
                        that.ErrorTip.show("修改姓名成功");
                        that.postGetValidate();
                    }
                }
                $.ajax({
                    type: "POST",
                    url: that.apiConfig.url + "update_ocr_info/pub_key/" + that.apiConfig.pub_key + "/order_type/h5",
                    data: JSON.stringify(postData),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: successFn
                });
            }
        },
        //api:获取活体检测唇语验证码接口
        postGetValidate: function() {
            var that = this;
            that.ErrorTip.show("验证码获取中，请等待。。。", that.time2wait);
            var postData = {
                package_session_id: that.package_session_id,
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                sign_time: (new Date()).format('yyyyMMddhhmmss')
            }
            postData.sign = hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                //{"partner_order_id":"0001","living_validate_data":"0962","package_session_id":"154606505226665984"}
                if (!data.result.success) {
                    that.ErrorTip.show("验证码获取失败：" + data.result.message, 3000);
                } else {
                    that.ErrorTip.show("验证码获取成功", 100);
                    that.package_session_id = data.data.package_session_id;
                    $(".take-num").text(data.data.living_validate_data);
                    that.showStep(3);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "get_living_validate_data/pub_key/" + that.apiConfig.pub_key + "/order_type/h5",
                data: JSON.stringify(postData),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn
            });
        },
        //api:活体检测接口
        upload3: function() {
            var that = this;
            if(!that.package_session_id){
                that.ErrorTip.show("请按顺序进行验证");
                return;
            }else if (!that.minVid) {
                that.ErrorTip.show("请先上传视频");
            } else {
                that.ErrorTip.show("活体检测中，请等待。。。", that.time2wait);
                var postData = {
                    package_session_id: that.package_session_id,
                    package_code: that.package_code,
                    partner_order_id: that.partner_order_id,
                    extension_info: that.extension_info,
                    sign_time: (new Date()).format('yyyyMMddhhmmss'),
                    living_video: that.minVid.substr(that.minVid.indexOf(",")+1,that.minVid.length-1)
                }
                postData.sign = hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

                function successFn(data) {
                    if (!data.result.success) {
                        that.ErrorTip.show(data.result.message, 3000);
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
                    data: JSON.stringify(postData),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: successFn
                });
            }
        },
        //api:身份验证、人像比对组合接口
        compare: function() {
            var that = this;
            that.ErrorTip.show("人像比对中，请等待。。。", that.time2wait);
            var postData = {
                package_session_id: that.package_session_id,
                package_code: that.package_code,
                partner_order_id: that.partner_order_id,
                extension_info: that.extension_info,
                sign_time: (new Date()).format('yyyyMMddhhmmss'),
                living_photo: that.return_photo
            }
            postData.sign = hex_md5("pub_key=" + that.apiConfig.pub_key + "|partner_order_id=" + postData.partner_order_id + "|sign_time=" + postData.sign_time + "|security_key=" + that.apiConfig.security_key)

            function successFn(data) {
                if (!data.result.success) {
                    that.ErrorTip.show(data.result.message, 3000);
                    setTimeout(function(){
                        that.postGetValidate();
                    },2000);
                } else {
                    that.package_session_id = data.data.package_session_id;
                    that.ErrorTip.show("验证完成");
                    if(data.data.similarity){
                        data.data.similarity=+data.data.similarity;
                    }else{
                        data.data.similarity=0;
                    }
                    var num_step=5;
                    if(data.data.similarity<0.2){
                        num_step=1;
                    }else if(data.data.similarity<0.4){
                        num_step=2;
                    }else if(data.data.similarity<0.6){
                        num_step=3;
                    }else if(data.data.similarity<0.8){
                        num_step=4;
                    }
                    $("#quan").attr("src","images/num_step"+num_step+".png");

                    $("#like-num").text((+data.data.similarity).toFixed(2)*100+"%");
                    $("#suinfo_info").text({T:"认证通过",F:"认证失败",C:"人工审核"}[data.data.auth_result]);
                    $(".suinfo-pan").hide();
                    $("#suinfo_"+data.data.auth_result).show();
                    that.showStep(4);
                }
            }
            $.ajax({
                type: "POST",
                url: that.apiConfig.url + "idcard_verify_and_compare/pub_key/" + that.apiConfig.pub_key + "/order_type/h5",
                data: JSON.stringify(postData),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: successFn
            });
        },

    }

    $(document).ready(function() {
        h5_upload.init();
        // $(document).on("click", "#ErrorTipModal", function(){
        //   h5_upload.ErrorTip.hide();
        // });
    });

// })();
