'use strict';

angular.module('cloudxWebApp')
    .controller('RuleConditionController', function ($scope, $state, $compile, $uibModal,
    		$stateParams, ruleConditionList, ruleCondition, ruleInstanceDetail) {


    	$scope.ruleInstanceId = $stateParams.id;
    	$scope.strategyId = $stateParams.strategyId;
    	$scope.ruleConditionList = [];
    	//$scope.isChosen = [];
        $scope.sum = 0;
    	$scope.defaultRuleCondition = {
			authorization: '1',
			code: 'cp_1',
			id: '55f2707cf2b26d3443af50e6',
			isPay: '0',
			isSynchronization: '0',
			name: '#n#小时内，手机号移动距离≥#x#KM'
    	};
        $scope.isPay = {
            "-1": "全部",
            "0": "免费",
            "1": "付费"
        };
        $scope.isSynchronization = {
            "-1": "全部",
            "0": "实时",
            "1": "非实时",
            "2": "准实时"
        };
        $scope.authorization = {
            "-2": "全部",
            "-1": "未开通",
            "0": "已开通",
            "2": "默认开通",
            "3": "未开通"
        };
        //筛选
        $scope.isinTime = function(e){
            var temptime = e.target.innerText,
                temp = e.target.attributes['thevalue'].value;
            $scope.timeStatus = (temp == -1?'':temp);
            $scope.istime = temptime;
            $scope.searchText = '';
        };
        $scope.isinfree = function(e){
            var temppay = e.target.innerText,
                temp = e.target.attributes['thevalue'].value;
            $scope.freeStatus = (temp == -1?'':temp);
            $scope.isfree = temppay;
            $scope.searchText = '';
        };
        $scope.isbeopen = function(e){
            var tempopen = e.target.innerText,
                temp = e.target.attributes['thevalue'].value;
            $scope.openStatus = (temp == -2?'':temp);
            $scope.isopen = tempopen;
            $scope.searchText = '';
        };
        $scope.searchReset = function(){
            $scope.istime = '实时性';
            $scope.isfree = '是否收费';
            $scope.isopen = '开通情况';
            $scope.freeStatus = '';
            $scope.openStatus = '';
            $scope.timeStatus = '';
            $scope.istabshow = 0;
        };
    	$scope.getRuleDetail = function(){
    		ruleInstanceDetail.get({ruleInstanceID: $stateParams.id}, function(result){
    			$scope.ruleInstance = result;
    		});
    	};
    	$scope.getRuleConitionList = function(){
    		ruleConditionList.get({}, function(result){
    			$scope.ruleConditionList = result;
                for (var i = $scope.ruleConditionList.length - 1; i >= 0; i--) {
                    $scope.ruleConditionList[i].isChosen = false;
                    if ($scope.ruleConditionList[i].authorization == -1) {
                        $scope.ruleConditionList[i]._title = "规则条件对应数据服务未开通，如需开通请联系有盾商务人员";
                    };
                };
            });
    	};
        $scope.setHeight = function(){
            var _height = $(document).height()-224;
            var _heightContent = $(document).height()-345;
            $('.ud_panel-1').height(_height);
            $('.ud_panel_content-addrule').height(_heightContent);
        }
        
    	$scope.init = function(){
    		$scope.getRuleDetail();
    		$scope.getRuleConitionList();
            $scope.searchReset();
            $scope.setHeight();
    	};
    	$scope.init();
        $scope.cart = function(obj,e){
            if (obj.authorization == -1) {
                return;
            }
            obj.isChosen = !(obj.isChosen);
            if (obj.isChosen == true) {
                $scope.sum ++;
            }else{
                $scope.sum --;
            }
            $scope.countCartDetail();
            $scope.tip_ruleCondition = {invalid: false, info: ''};
            //购物车数量动画
            $('#ud_animation').removeClass("run-animation");
            $('#ud_animation').width($('#ud_animation').width('#ud_animation'));
            $('#ud_animation').addClass("run-animation");
        };
        $scope.cartCheck = function(e){
            e = window.event || e;
            if (e.target.checked == true) {
                $scope.sum ++;
            }else{
                $scope.sum --;
            }
            $scope.countCartDetail();
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            //购物车数量动画
            $('#ud_animation').removeClass("run-animation");
            $('#ud_animation').width($('#ud_animation').width('#ud_animation'));
            $('#ud_animation').addClass("run-animation");
        };
        $scope.countCartDetail = function(){
            $scope.cartDetails = [];
            for(var i=0; i<$scope.ruleConditionList.length; i++){
                if($scope.ruleConditionList[i].isChosen === true){
                    $scope.cartDetails.push($scope.ruleConditionList[i]);
                }
            }
        };
        $scope.showCartDetail = function(){
            $scope.istabshow = !($scope.istabshow);
            if ($scope.istabshow) {
                $(".glyphicon").removeClass('glyphicon-menu-hamburger');
                $('.glyphicon').addClass('glyphicon-remove');
            }else{
                $(".glyphicon").removeClass('glyphicon-remove');
                $('.glyphicon').addClass('glyphicon-menu-hamburger');
            }
        };
        $scope.cancelChoice = function(e){
            for(var i=0; i<$scope.ruleConditionList.length; i++){
                if($scope.ruleConditionList[i].id == e){
                    $scope.ruleConditionList[i].isChosen = false;
                }
            }
            for(var i=0; i<$scope.cartDetails.length; i++){
                if($scope.cartDetails[i].id == e){
                    $scope.cartDetails.splice(i,1);
                    $scope.sum --;
                }
            }
        };
    	$scope.save = function(){
    		$scope.ruleConditions = [];
    		for(var i=0; i<$scope.ruleConditionList.length; i++){
    			if($scope.ruleConditionList[i].isChosen === true){
    				$scope.ruleConditions.push({id: $scope.ruleConditionList[i].id});
    			}
    		}
            if($scope.ruleConditions.length !== 0){
                $scope.savePromise = ruleCondition.post({ruleInstanceID: $scope.ruleInstanceId}, {ids: $scope.ruleConditions})
                    .$promise.then(function(result){
                        $state.go('ruleDetail', {strategyId:$scope.strategyId ,id:$scope.ruleInstanceId});
                    },
                    function(err){
                        $uibModal.open({
                            animation:true,
                            backdrop: 'static',
                            templateUrl: 'failAdd.html',
                            controller:'resultController'
                        });
                    });
            }
            else {

                $uibModal.open({
                    animation:true,
                    backdrop: 'static',
                    templateUrl: 'noChosen.html',
                    controller:'resultController'
                });
            }
    	};
    })
    .controller('resultController', function($scope, $state, $uibModalInstance){

        $scope.next = function() {
        	$uibModalInstance.close();
        };

        $scope.cancel = function(){
            $uibModalInstance.dismiss();
        };
    })
    ;
