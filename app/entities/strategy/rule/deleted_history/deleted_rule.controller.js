'use strict';

angular.module('cloudxWebApp')
	.controller('deleteRuleHistoryController', function($scope, ParseLinks, $uibModal,
                $compile,
				getSearchPropertiesService, DeletedRule, $stateParams, $state,
				getRuleInstanceListService, strategyProperty){

		//page-relative init
		$scope.page = 1;
		$scope.per_page = 10;
		$scope.scroll = 0;
		$scope.rollPage = false;
		$scope.ruleInstanceCode='';
		$scope.strategyInstanceId = $stateParams.strategyId;

        //loading init
        $scope.load_flag = true;
    	$scope.load_list_flag = true;


		//value init
		$scope.selectStrategyList = [];
		$scope.allStrategyOption = {name:'全部业务', code:''};
        $scope.selectStrategy = {code:''};  //商户选择的攻略的code
        $scope.selectScenario = {code:''};  //商户选择的场景...
        $scope.selectSolution = {code:''};  //商户选择的锦囊...
        $scope.sortType='';
        $scope.timeType='';

		//search items init
		$scope.sortTypes = [
			{
		     	'code': '',
		     	'name': '全部'
		    },
			{
		      	'code': 'score_desc',
		      	'name': '由高到低'
		  	},
		  	{
		       'code': 'score_asc',
		      	'name': '由低到高'
		  	}
		];

        $scope.dateRange = [
            {
            	'code':'',
            	'name':'全部'
            },
            {
            	'code':'oneWeek',
            	'name':'最近一周'
            },
            {
            	'code':'oneMonth',
            	'name':'近一个月'
            },
            {
            	'code':'threeMonth',
            	'name':'近三个月'
            }
        ];

		//loading init

    	//initial the value
    	$scope.myPay = ['免费', '收费'];
    	$scope.mySynchronization = ['实时', '非实时','准实时'];
    	$scope.authorization = {
    			'-1': '未开通',
    			'0':'已开通',
    			'1':'申请中',
    			'2':'默认开通'
    	};

        //datepicker init
        var today = new Date();
        today = today.getFullYear()+'/'+today.getMonth()+'/'+today.getDate();

        $scope.startDate = '';
        $scope.endDate = '';

        $scope.openStartDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = true;
            $scope.endOpened = false;
            $scope.timeType ='other';
            $scope.maxDate= $scope.endDate;
        };

        $scope.openEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.startOpened = false;
            $scope.endOpened = true;
            $scope.timeType ='other';
            $scope.maxDate= new Date();
            $scope.minDate1=$scope.startDate;
        };
        $scope.validate_name = function() {
            if(($scope.endDate!=='')&&($scope.endDate!==null)&&($scope.endDate!==undefined)) {
                if ($scope.startDate > $scope.endDate) {
                    $scope.tip_name = {invalid: true, info: '终止日期不能小于起始日期'};
                }
                else {
                    $scope.tip_name = {invalid: false};
                }
                return !($scope.tip_name.invalid);
            }
        };

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            showWeeks: false,
            mixMode: 'day',
            maxMode: 'day'
        };

        //显示编码搜索按钮
        $scope.showBtn = function(){
            //$scope.btnVisible = true;
            angular.element('#codeSearchLine').append($compile('<input type="button" id="codeSearchBtn" class="rm_btn_sm rm_btn_primary item_ipt" ng-click="getRuleInstanceListByCode()" value="搜索"/>')($scope));
            angular.element('body').bind('click', function(e){
                var btn = angular.element('#codeSearchBtn');
                var input = angular.element('#codeInput');
                var target = e.target;
                var clickBtn = btn.is(target);
                var clickSelf = input.is(target);
                console.log(clickBtn);
                console.log(clickSelf);
                if(clickBtn){
                    angular.element('body').unbind('click');
                    btn.remove();
                }
                else if(clickSelf){
                }
                else{
                    btn.remove();
                    console.log('end');
                    angular.element('body').unbind('click');
                }
            });
        };

        //get search conditions
        $scope.getSearchProperties = function(){
        	$scope.load_flag = false;
        	$scope.scenarioInstanceList = [];

        	strategyProperty.get({strategyInstanceId:$state.params.strategyId}, function (result) {
                $scope.strategyInstance = result;
                for(var i=0; i<$scope.strategyInstance.scenarioInstanceDTOs.length; i++){
            		$scope.scenarioInstanceList.push($scope.strategyInstance.scenarioInstanceDTOs[i]);
        		}
                $scope.setScenario(-1);
                $scope.load_flag = true;
        	});
            /*getSearchPropertiesService.getSearchProperties({}, function(result){
                console.log(result);
                $scope.strategyInstanceList = result;
                if($scope.strategyInstanceList.length == 0){
					$scope.noStrategy = false;
                	var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        templateUrl: 'app/entities/strategyCreate/strategyCreate-step1.html',
                        controller: 'StrategyCreateStep1Controller'
                    });
                }
                //$scope.setPlatform(0);
                //$scope.setStrategy();  //默认选择第一个攻略
	            //$scope.selectPlatform = $scope.PlatformList[0];
	            //$scope.setPlatform();
                $scope.load_flag = true;
            });*/
        };

        //set search conditions
        $scope.setSearchProperties = function() {
            //重置搜索结果
        	if($scope.addPage === false) {
                $scope.ruleInstanceList = [];
                $scope.page = 1;
                $scope.onOff = [];
        	}

            //设置搜索条件
            $scope.ruleSearchConditions = {
                        ruleCode: '',
                        strategyCode: $scope.strategyInstance.strategyInstanceCode,
                        scenarioCode: $scope.selectScenario.scenarioInstanceCode,
                        solutionCode: $scope.selectSolution.solutionInstanceCode,
                        status: '',
                        sortType: $scope.sortType,
                        page: $scope.page,
                        per_page: $scope.per_page,
                        startModifiedTime: $scope.startDate,
                        endModifiedTime: $scope.endDate
            };

        };

        //get delete rule list
        $scope.loadAll = function(){
        	$scope.load_list_flag = false;
        	DeletedRule.searchDeletedRule($scope.ruleSearchConditions, function(result){
        		if(result[0] !== null){
                    for (var i = 0; i < result.length; i++) {
                        $scope.ruleInstanceList.push(result[i]);
                    }
                    $scope.rollPage = true;
                }
                else {
                    console.log('获取失败');    //待处理
                }
            	$scope.load_list_flag = true;
        	});
        };

        $scope.getRuleInstanceList = function(){
        	$scope.addPage = false;
        	$scope.setSearchProperties();
        	$scope.loadAll();
        	$scope.addPage = true;
            $scope.ruleCodeOrName = '';
        };

        $scope.loadPage = function(page) {
        	if($scope.rollPage === true) {
                $scope.page = page;
                $scope.setSearchProperties();
                $scope.loadAll();
        	}
         };

        $scope.setDateRange = function (index) {
            console.log(index);
            if (index == -1) {
                $scope.startDate ='';
                $scope.endDate = '';
            }
            else {
                $scope.timeType = $scope.dateRange[index].code;
                if ( $scope.dateRange[index].code === '') {
                    $scope.startDate = '';
                    $scope.endDate = '';
                }
                if ($scope.dateRange[index].code == 'oneWeek') {
                    $scope.endDate = new Date();
                    $scope.startDate = new Date();
                    $scope.startDate.setDate($scope.startDate.getDate() - 7);
                }
                else if ($scope.dateRange[index].code == 'oneMonth') {
                    $scope.endDate = new Date();
                    $scope.startDate = new Date();
                    $scope.startDate.setMonth($scope.startDate.getMonth() - 1);
                }
                else if ($scope.dateRange[index].code == 'threeMonth') {
                    $scope.endDate = new Date();
                    $scope.startDate = new Date();
                    $scope.startDate.setMonth($scope.startDate.getMonth() - 3);
                }
            }
            $scope.getRuleInstanceList();
        };

        $scope.getRuleInstanceListByCode = function(){
	        	$scope.ruleInstanceList = [];
	        	$scope.rollPage = false;
	        	$scope.page = 1;
	            $scope.onOff = [];

	            $scope.ruleSearchConditions = {
	            		ruleCode: $scope.ruleCodeOrName,
                        strategyCode: $scope.strategyInstance.strategyInstanceCode,
	                    scenarioCode: '',
	                    solutionCode: '',
	                    status: '',
	                    sortType: '',
	                    page: 1,
	                    per_page: 10,
	                    startModifiedTime: undefined,
	                    endModifiedTime: undefined
	            };

	            DeletedRule.searchDeletedRule($scope.ruleSearchConditions, function(result, headers){
	                if(result[0] !== null){
	                    $scope.links = ParseLinks.parse(headers('link'));
	                    for (var i = 0; i < result.length; i++) {
	                        $scope.ruleInstanceList.push(result[i]);
	                        if($scope.ruleInstanceList[i].status == '0'){
	                        	$scope.onOff.push(true);
	                        }
	                        else{
	                        	$scope.onOff.push(false);
	                        }
	                    }
	                	$scope.rollPage = true;
	                }
	                else {
	                    console.log('获取失败');    //待处理
	                }
	            	$scope.load_flag = true;
	            });
                $scope.ruleInstanceCode = '';
                $scope.timeType = '';
                $scope.startDate = '';
                $scope.endDate = '';
                $scope.selectScenario.scenarioInstanceCode ='';
                $scope.solutionInstanceList = undefined;
                $scope.selectSolution.solutionInstanceCode ='';

        };




		//all kinds of set function

		$scope.setSortType = function (index) {
	            //将sortType更新为商户所选的分值排序类型
	            $scope.sortType = $scope.sortTypes[index].code;
	            //获取规则列表
	            $scope.getRuleInstanceList();
	    };

	    $scope.setStrategy = function (){

            //初始化场景和锦囊
            $scope.ruleInstanceList = [];
            $scope.selectScenario.code = '';
            $scope.selectSolution.code = '';

            if($scope.selectStrategyList.length !== 0){
            	$scope.scenarioInstanceList = [];
            	if($scope.selectStrategy.code === ''){
            		for(var i=1; i<$scope.selectStrategyList.length; i++){
            			if($scope.selectStrategyList[i].scenarioPropertyDTOs !== undefined){

                			for(var j=0; j<$scope.selectStrategyList[i].scenarioPropertyDTOs.length; j++){
                				$scope.scenarioInstanceList.push($scope.selectStrategyList[i].scenarioPropertyDTOs[j]);
                			}
            			}
            		}

            	}
            	else {
                    $scope.selectStrategy.code = $scope.selectStrategy.code;
                    $scope.scenarioInstanceList = $scope.selectStrategy.scenarioPropertyDTOs;
            	}
            }

            $scope.setScenario(-1);
        };

        $scope.setScenario = function (index) {
            if (index==-1) {    //选择“全部”场景
                $scope.selectScenario.scenarioInstanceCode = '';    //所选场景code重置为空
                $scope.solutionInstanceList = [];
                for(var i=0; i<$scope.scenarioInstanceList.length; i++){
        			for(var j=0; j<$scope.scenarioInstanceList[i].solutionInstanceDTOs.length; j++){
        				$scope.solutionInstanceList.push($scope.scenarioInstanceList[i].solutionInstanceDTOs[j]);
        			}
        		}
            } else {
                $scope.selectScenario.scenarioInstanceCode = $scope.scenarioInstanceList[index].scenarioInstanceCode;
                $scope.solutionInstanceList = $scope.scenarioInstanceList[index].solutionInstanceDTOs;
            }

            $scope.setSolution(-1);
        };

        $scope.setSolution = function (index) {
            if (index==-1) {    //选择“全部”锦囊
                $scope.selectSolution.solutionInstanceCode = '';    //所选锦囊code重置为空
            } else {
                $scope.selectSolution.solutionInstanceCode = $scope.solutionInstanceList[index].solutionInstanceCode;
            }
            $scope.getRuleInstanceList();
        };



        //load
        $scope.load = function(){
        	$scope.getSearchProperties();
        	console.log('start..');
        };
		$scope.load();

	});
