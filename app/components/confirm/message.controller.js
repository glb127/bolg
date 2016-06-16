angular.module('cloudxWebApp')
    .controller('MessageModalController', function ($scope,$state,$timeout, $uibModalInstance, serviceCode) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
            $timeout.cancel(time);
        };
        $scope.ok = function (id) {
            $uibModalInstance.dismiss();
            $scope.callback();
        };
        $scope.rightFlag = serviceCode.rightPic;//正确绿色勾勾
        $scope.message = serviceCode.message;//显示内容
        if(!$scope.message){
        	$uibModalInstance.dismiss();
        }
        if(serviceCode.callback){
        	$scope.showButtom=true;
        }
        $scope.callback = serviceCode.callback||angular.noop;//回调
        var time;
        if(!$scope.showButtom){
	        time = $timeout(function() {
	            $uibModalInstance.dismiss();
	        },3000);
		}
    })
	.run(["$templateCache", function($templateCache) {
	    $templateCache.put("MessageModal.html",
	    	"<div class=\"rm_modal\">\n" +
			"    <div class=\"rm_modal_header\">\n" +
			"        <h3>提示</h3>\n" +
			"        <a class=\"iconfont modal_close\" ng-click=\"cancel()\">&#xe626;</a>\n" +
			"    </div>\n" +
			"    <div class=\"rm_modal_content rm_modal_text_content\">\n" +
			"        <div class=\"rm_modal_text_item\">\n" +
			"            <div ng-show=\"rightFlag\" class=\"iconfont fs64 cgreen\">&#xe6c0;</div>\n" +
			"            <div>{{message}}</div>\n" +
			"        </div>\n" +
			"    </div> \n" + 
			"	<div ng-show=\"showButtom\" class=\"rm_modal_footer\">\n" +
		    "        <div class=\"pull_center\">\n" +
		    "            <button class=\"rm_nbtn rm_nbtn_primary\" ng-click=\"cancel()\">取消</button>\n" +
		    "            <button class=\"rm_nbtn rm_nbtn_primary\" ng-click=\"ok()\">确定</button>\n" +
		    "        </div>\n" +
		    "        <div class=\"clearfix\"></div>\n" +
		    "    </div>\n" + 
			"</div>");
	}])

    .factory('ErrorTipModal', function($timeout){
    	var dom = "<div  id='ErrorTipModal' class='error_tip_frame'><div class='error_tip_inner'>{{message}}</div></div>";
        var obj,time;
        return {
            show:function(message){
                if(!message){
                    return;
                }
                if(obj){
                    $timeout.cancel(time);
                    obj.remove();
                }
            	obj=angular.element(dom.replace("{{message}}",message)).appendTo("body");
            	time = $timeout(function() {                   
                    obj.fadeOut(1000, function() {
                        obj.remove();
                    	obj="";
                    });
		        },1000);
            },
            hide:function(){
                $timeout.cancel(time);
            	obj.fadeOut(1000, function() {
                    obj.remove();
                	obj="";
                });
            }
        };

    })
