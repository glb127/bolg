'use strict';

angular.module('cloudxWebApp')
	.controller('deleteRuleHistoryDetailController', function($scope, $state, $stateParams, ruleInstanceDetail, ruleHistory, getRuleInstanceHistoryService){

    	//initial the value
    	$scope.myPay = ['免费', '收费'];
    	$scope.mySynchronization = ['实时', '非实时','准实时'];
    	$scope.authorization = {
    			'-1': '未开通',
    			'0':'已开通',
    			'1':'申请中',
    			'2':'默认开通'
    	};
    	$scope.statuss = {
    			'0':'启用',
    			'-1':'删除',
    			'1': '停用'

    	};

		//获取被删除规则详情
    	$scope.getRuleDetail = function(){
    		$scope.load_flag = false;
    		ruleInstanceDetail.get({ruleInstanceID: $stateParams.id}, function(result){
				console.log(result);
    			$scope.deleteHistory = result;
    			$scope.ruleInstanceName = $scope.deleteHistory.name;
    			//$scope.ruleInstance = {name:"防重复登录", id:"123", code:"GZ12345", score:"60", strategyInstanceName:"攻略1", scenarioInstanceName:"场景1", solutionInstanceName:"锦囊1", ruleParameters:[{name:"最多登录次数", value:"3"}, {name:"一天最多不同id数", value:"3"}]};

    			$scope.ruleInstanceCode = $scope.deleteHistory.code;
    			$scope.ruleInstanceScore = $scope.deleteHistory.score;
    		});
    	};


        //获取规则历史
        $scope.getRuleHistory = function () {
            //$scope.load_flag = false;
            /*getRuleInstanceHistoryService.getRuleInstanceHistory({ruleInstanceCode: $scope.ruleInstanceCode}, function (result) {
             $scope.ruleHistory = result;
             for (var i = 0; i < $scope.ruleHistory.length; i++) {
             $scope.historyOpen[i] = false;
             //$scope.historyClose[i] = true;
             }
             $scope.load_flag = true;
             //$scope.ruleHistory = [{id:'asfdsdfsdfs', code:'GZ123', name:'攻略1', operateType:'更新', score:'60', lastModifiedDate:'1437113516685'}, {id:'asfdsdfsdfsa', name:'攻略1', code:'GZ1234', operateType:'新增', score:'20', lastModifiedDate:'1137113516685'}];
             for(var i=0; i<$scope.ruleHistory.length; i++) {
             $scope.ruleHistory[i].lastModifiedDate = $scope.timeFormat($scope.ruleHistory[i].lastModifiedDate);
             alert($scope.ruleHistory[i].lastModifiedDate);
             }
             });*/

            ruleHistory.get({ruleInstanceId:$stateParams.id}, {}, function(result){
                $scope.ruleHistory = result;
                for (var i = 0; i < $scope.ruleHistory.length; i++) {
                    $scope.historyOpen[i] = false;
                }
            });
        };

		$scope.openCloseCollapse = function (index) {
			$scope.historyOpen[index] = !$scope.historyOpen[index];
		};

    	$scope.init = function(){
        	$scope.ruleInstanceCode = $stateParams.id;
    		//alert($stateParams.id);

        	$scope.ruleName = false;
        	$scope.ruleNameModify = true;
        	$scope.abandonModifyRuleName = true;
        	$scope.allowModifyRuleName = false;

        	$scope.ruleCode = false;
        	$scope.ruleCodeModify = true;
        	$scope.allowModifyRuleCode = false;
        	$scope.abandonModifyRuleCode = true;
        	$scope.codeRepeat = true;

        	$scope.ruleScore = false;
        	$scope.ruleScoreModify = true;
        	$scope.allowModifyRuleScore = false;
        	$scope.abandonModifyRuleScore = true;

        	//$scope.ruleInstance = {name:"防重复登录", code:"GZ12345", score:"60", ruleParameters:[{name:"最多登录次数", value:"3"}, {name:"一天最多不同id数", value:"3"}]};
        	//$scope.ruleHistory = [{id:"asfdsdfsdfs", name:"攻略1", operateType:"更新", score:"60", lastModifiedDate:"1437113516685"}, {id:"asfdsdfsdfsa", name:"攻略1", operateType:"新增", score:"20", lastModifiedDate:"1137113516685"}];


        	$scope.historyOpen = [];
        	//$scope.historyClose = [];

        	$scope.getRuleDetail();

        	$scope.getRuleHistory();
    	};

    	$scope.init();
	});
