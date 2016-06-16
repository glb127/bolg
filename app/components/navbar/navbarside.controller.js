'use strict';

angular.module('cloudxWebApp')
    .controller('NavbarsideController', function ($scope, $compile, $location, $state, $stateParams, Auth, Principal, apiStrategy) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;

        $scope.strategyInstanceList =[];
        $scope.strategyList = true;
        $scope.dataServiceMenu = true;
        $scope.riskEventMenu = true;

    	$scope.strategyList_narrow = true;
    	$scope.dataServiceMenu_narrow = true;
        $scope.riskEventMenu_narrow = true;

        $scope.accessHelperMap={
            // "brief_introduction":"系统简介",
            // "noun_interpretation":"名词解释",
            // "module":"功能模块",
            "data_security":"数据安全",
            "question_and_answer":"QA"
        }

        $scope.init = function(){
            apiStrategy.get({},function(data){
                if(!!data[0]) {
                    $scope.strategyInstanceList = data;
                    $scope.selectCode = $scope.strategyInstanceList[0].code;
                }
            });
        };

        $scope.init();

        $scope.logout = function () {
            Auth.logout();
            $state.go('login');
        };

        Principal.identity().then(function(account) {
            $scope.account = account;
        });

        $scope.dynamicPopover = {
            //content: "",
            templateUrl: 'myPopoverTemplate.html'
        };

        $scope.expand = function () {
            $('.narrow').hide();
            $('.wide').show();
            $('.rm_right_header').css('left', '200px');
            $('.rm_right_content').css('left', '200px');
        };


        $scope.collapse = function () {
            $('.wide').hide();
            $('.narrow').show();
            $('.rm_right_header').css('left', '80px');
            $('.rm_right_content').css('left', '80px');
        };

        $('.rm_right_header').css('box-shadow', '0 0 7px #999');
        //$('.rm_right_content').css('box-shadow', '0 0 7px #333');

        if($stateParams.isNarrow === 'true'){
            $scope.collapse();
        }
        else {
            $scope.expand(); //default as wide side-navbar
        }

        //展示攻略中心二级导航
        $scope.showStrategyList = function(){
            $scope.closeAll();
        	$scope.strategyList = false;

        };

        $scope.closeStrategyList = function(){
            $scope.closeAll();
        };

        $scope.showStrategyListNarrow = function(){
            $scope.closeAll();
        	$scope.strategyList_narrow = false;

        };

        $scope.closeStrategyListNarrow = function(){
            $scope.closeAll();
        };

        //选中攻略列表
        $scope.selectStrategy = function(id, isNarrow){
        	$scope.selectCode = id;
        	$state.go('ruleCenter',{strategyId: id,isNarrow:isNarrow});
        };

        //展示数据服务二级导航
        $scope.showDataServiceMenu = function(){
            $scope.closeAll();
        	$scope.dataServiceMenu = false;
        };

        $scope.closeDataServiceMenu = function(){
            $scope.closeAll();
        };

        $scope.showDataServiceMenuNarrow = function(){
            $scope.closeAll();
        	$scope.dataServiceMenu_narrow = false;
        };

        $scope.closeDataServiceMenuNarrow = function(){
            $scope.closeAll();
        };

        // 风险事件二级导航
        $scope.showRiskEventMenu = function(){
            $scope.closeAll();
            $scope.riskEventMenu = false;
        };

        $scope.closeRiskEventMenu = function(){
            $scope.closeAll();
        };

        $scope.showRiskEventMenuNarrow = function(){
            $scope.closeAll();
            $scope.riskEventMenu_narrow = false;
        };

        $scope.closeRiskEventMenuNarrow = function(){
            $scope.closeAll();
        };


        $scope.closeAll = function(){
        	$scope.dataServiceMenu = true;
        	$scope.strategyList = true;
            $scope.riskEventMenu = true;
        	$scope.strategyList_narrow = true;
        	$scope.dataServiceMenu_narrow = true;
            $scope.riskEventMenu_narrow = true;

        };

    });
