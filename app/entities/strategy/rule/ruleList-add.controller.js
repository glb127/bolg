'use strict';

angular.module('cloudxWebApp')
	.controller('RuleAddStep1Controller', function($scope, $compile, $state, StrategyInstanceListService,strategyInstanceList){


		//loading init
		$scope.load_flag = true;
		angular.element('body').append($compile('<div id="loading_group" ng-hide="load_flag"><div  class="loading"></div><div class="loading_cover"></div></div>')($scope));

		$scope.getStrategyListForMerchant = function(){
			$scope.load_flag = false;
			StrategyInstanceListService.getStrategyList({}, function(result){
				$scope.strategyListForMerchant = result;
				$scope.load_flag = true;
			});
		};
		$scope.getStrategyListForMerchant();

		$scope.saveAndNext = function(){
			$state.go('ruleList-add',{StrategyInstanceName:$scope.selec.name, StrategyTemplateCode: $scope.selec.strategyTemplate.code, StrategyInstanceCode: $scope.selec.code});
		};
	})

	.controller('RuleAddStep2Controller', function($scope, $stateParams, $uibModal, StrategyTemplateService, ScenarioTemplateListService, RuleTemplateListService, createRuleInstanceService, ParseLinks){
		$scope.myPay = ['免费', '收费'];
        $scope.mySynchronization = ['实时', '非实时','准实时'];
    	$scope.authorization = {
    			'-1': '未开通',
    			'0':'已开通',
    			'1':'申请中',
    			'2':'默认开通'
    	};
		$scope.page = 1;
		$scope.per_page = 10;
		$scope.scroll = 0;
		$scope.ruleTemplateList = [];
		$scope.addPage = false;
		//$scope.StrategyInstanceName = $stateParams.StrategyInstanceName;
		//$scope.StrategyTemplateCode = $stateParams.StrategyTemplateCode;
		$scope.StrategyInstanceCode = $stateParams.code;
		$scope.strategyInstanceId = $stateParams.strategyId;
		$scope.ScenarioTemplateListForStrategy = [];
		$scope.SolutionTemplateList = [{code:'', name:'全部'}];

		//loading init
		$scope.load_flag = true;
		$scope.load_list_flag = true;

		//初始化界面
		$scope.init = function(){
			$scope.load_flag = false;
			StrategyTemplateService.getStrategyTemplate({code: $scope.StrategyInstanceCode}, function(result){

				//得到模板编码
				$scope.StrategyInstanceName = result.strategyInstanceName;
				$scope.StrategyTemplateCode = result.strategyTemplateCode;

				//得到场景模板
				ScenarioTemplateListService.getScenarioTemplateList({strategyInstanceId:$scope.strategyInstanceId}, function(result){
					for(var i=0; i<result.length; i++){
						$scope.ScenarioTemplateListForStrategy.push(result[i]);
					}
					$scope.load_flag = true;
					$scope.setScenario(0);
				});

			});
		};
		$scope.init();

		$scope.setScenario = function(index){
			$scope.noResultTip = 0;
			$scope.addPage = false;
			$scope.selectScenarioCode = $scope.ScenarioTemplateListForStrategy[index].code;
			$scope.SolutionTemplateList = [{code:'', name:'全部'}];

			for(var i=0; i<$scope.ScenarioTemplateListForStrategy[index].solutionTemplates.length; i++){
				$scope.SolutionTemplateList.push($scope.ScenarioTemplateListForStrategy[index].solutionTemplates[i]);
			}

			$scope.setSolution(0);
		};

		$scope.setSolution = function(index){
			$scope.noResultTip = 0;
			$scope.addPage = false;
			$scope.selectSolutionCode = $scope.SolutionTemplateList[index].code;
			$scope.getRuleTemplateList();
		};

		$scope.setSearchCondition = function(){
			//初始化查询结果
			if($scope.addPage == false){
				$scope.ruleTemplateList = [];
				$scope.page = 1;
			}

			//设置搜索条件
			$scope.searchContion = {
				page: $scope.page,
				per_page: $scope.per_page,
				strategyInstanceCode: $scope.StrategyInstanceCode,
				strategyTemplateCode: $scope.StrategyTemplateCode,
				scenarioTemplateCode: $scope.selectScenarioCode,
				solutionTemplateCode: $scope.selectSolutionCode
			};
		};

		$scope.loadAll = function(){
			$scope.load_list_flag = false;
			RuleTemplateListService.getRuleTemplateList($scope.searchContion, function(result, header){
				$scope.links = ParseLinks.parse(header('link'));
				$scope.scroll=1;
				if (result.length == 0) {
					$scope.noResultTip = 1;
				}else{
					for (var i = 0; i < result.length; i++) {
						$scope.ruleTemplateList.push(result[i]);
					}
				}
			});
			$scope.load_list_flag = true;
		};

		$scope.getRuleTemplateList = function(){
			$scope.setSearchCondition();
			$scope.loadAll();
		};

		$scope.loadPage = function(page){
			if($scope.scroll==1){
				$scope.page = page;
				$scope.addPage = true;
				$scope.getRuleTemplateList();
				$scope.addPage = false;
			}
		};

		$scope.createNewRule = function(ruleTemplateCode){
			$scope.ruleCode = null;

			var modalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				templateUrl: 'createRuleEnsure.html',
				controller:'createRuleInstanceController',
				resolve: {
					responseData: function(){
						return false;
					}
				}
			});

			modalInstance.result.then(function(result){
				//alert(ruleTemplateCode+"  "+$scope.StrategyInstanceCode);
				createRuleInstanceService.saveNewRule({ruleTemplateCode:ruleTemplateCode, strategyInstanceCode:$scope.StrategyInstanceCode},{}, function(result){
					$uibModal.open({
						animation: true,
						backdrop: 'static',
						templateUrl: 'createRuleResult.html',
						controller: 'createRuleInstanceController',
						resolve: {
							responseData: function(){
								if(!(result.code)) {	//if == null
									return "test";
								} else {
									$scope.getRuleTemplateList();
									return result.code;
								}
							}
						}
					});
				});
			})

		};
	})
	.controller("createRuleInstanceController", function ($scope, responseData, $uibModal, $uibModalInstance) {

		if (responseData) {
			$scope.successFlag = true;
			$scope.ruleInstanceCode = responseData;
		} else {
			$scope.successFlag = false;
		}

		$scope.cancel = function () {
			$uibModalInstance.dismiss();
		};

		$scope.next = function() {
			$uibModalInstance.close();
		};
	});
