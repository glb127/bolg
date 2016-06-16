'use strict';

angular.module('cloudxWebApp')
    .controller('RiskEventController', function ($scope,$state,RiskEvent,RiskEventCondition, ParseLinks, searchByConditionDTO) {

        $scope.init = function() {
            $scope.resultCount = 0; //查询结果总条数

            $scope.tip_strategy = {invalid: true, info: '请选择攻略'};   // tip of strategy select field
            $scope.tip_keyword = {invalid: false, info: ''};   // tip of keyword search field

            //事件查询页面数据数组
            $scope.riskEvent = [];
            //详情数据数组
            $scope.items = [];
            //开始页数
            $scope.page = 1;
            //（分页）每页大小
            $scope.pageSize = 50;
            //only can search by eventId or accountId
            $scope.eventIdAndAccountId='';

            //$scope.timeType='today';
            $scope.timeType='oneWeek';

            $scope.scenarioInstanceDTOs = [];

            $scope.riskLevels = [
                {'code': '',  'name': '全部'},
                {'code': '4', 'name': '极高风险'},
                {'code': '3', 'name': '高风险'},
                {'code': '2', 'name': '中风险'},
                {'code': '1', 'name': '低风险'},
                {'code': '0', 'name': '极低风险'}
            ];

            $scope.dateRange = [
                {'code':'today', 'name':'今天'},
                {'code':'oneWeek', 'name':'最近一周'},
                {'code':'oneMonth', 'name':'近一个月'},
                {'code':'threeMonth', 'name':'近三个月'}
            ];

            $scope.platforms = [
                {'code':'PL4333', 'name':'iOS'},
                {'code':'PL7397', 'name':'android'},
                {'code':'PL6811', 'name':'web'}
            ];

            $scope.dealSolutions = [
                {'code': '', 'name': '全部'},
                {'code': '9999', 'name': '阻止'},
                {'code': '0000', 'name': '放行'}
            ];

            $scope.conditionDTO = {
                'leftTime': new Date(), //较小事件时间
                'rightTime': new Date(),    //较大事件时间
                'eventId': '',  //事件ID
                'userId':'',    //账户Id
                'strategyInstanceName': '', //攻略实例名称
                'strategyInstanceCode': '', //攻略实例Code
                'platform': '', //应用平台
                'leftScore': '',    //较小决策分值
                'rightScore': '',   //较大决策分值
                'scenarioInstanceName': '', //场景实例名称
                'scenarioInstanceCode': '', //场景实例code
                'riskLevel': '',    //风险等级
                'eventIdAndAccountId': '',  //查询事件或账户ID：
                'retCode': '' ,  //处理结果
                'dateRange':''//事件时间
            };

            //时间控件
            $scope.openStartDate = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.startOpened = true;
                $scope.endOpened = false;
                $scope.maxDate = new Date();
                $scope.minDate=new Date((new Date()).setMonth(new Date().getMonth()-6));
            };

            $scope.openEndDate = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.startOpened = false;
                $scope.endOpened = true;
                $scope.timeType='other';
                $scope.maxDate1 = new Date();
                $scope.minDate1 = $scope.conditionDTO.leftTime;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1,
                showWeeks: false,
                mixMode: 'day',
                maxMode: 'day'
            };
        };
        $scope.init();

        //展开/收起高级搜索
        $scope.collapse = false;
        $scope.colExp = function () {
            $scope.collapse = !($scope.collapse);
        };

        //get strategy instance list & platform list
        $scope.getCondition = function(){
            $scope.conditionDTOs = [];
            RiskEventCondition.query({}, function(result) {
                for(var i=0;i<result.length;i++) {
                    $scope.conditionDTOs.push(result[i]);
                }
                //console.log($scope.conditionDTOs);

            });
        };
        $scope.getCondition();

        //翻译处理结果，翻译风险等级
        $scope.translateDealSolutionsAndRiskLevels = function(result){
            for(var i=0; i<result.length; i++){
                //retCode translate
                for(var j=0;j<$scope.dealSolutions.length;j++){

                    if(result[i].retCode==$scope.dealSolutions[j].code)
                    {
                        result[i].retCode=$scope.dealSolutions[j].name;
                    }
                }
                //riskLevels translate
                for(var j=0;j<$scope.riskLevels.length;j++){

                    if(result[i].riskLevel==$scope.riskLevels[j].code){
                        result[i].riskLevel=$scope.riskLevels[j].name;
                    }
                }
                //platform translate
                for(var j=0;j<$scope.platforms.length;j++){
                    if(result[i].platform==$scope.platforms[j].code){
                        result[i].platform=$scope.platforms[j].name;
                    }
                }
                $scope.riskEvent.push(result[i]);
            }
        };

        $scope.chosenStrategyName = '';
        $scope.setStrategy = function(item){
            $scope.chosenStrategyName = item.strategyInstanceName;
            $scope.tip_strategy = {invalid: false, info: ''};


            //console.log(item);
            //get scenario instance list by chosen strategy instance
            $scope.conditionDTO.strategyInstance = item;
            $scope.scenarioInstanceDTOs = $scope.conditionDTO.strategyInstance.scenarioInstanceDTOs;

            $scope.setScenario(-1);
        };

        /**
         * @version 2.1.4
         * @date 2015.11.12
         *
         * @description
         * 上一版本查询条件为平台的code
         * 现在改成平台的name
         *
         */
        $scope.setPlatform = function(){
            /*for(var i=0;i<$scope.platforms.length;i++){
                if(($scope.platforms[i].name)==($scope.conditionDTO.platform)){
                    $scope.conditionDTO.platform=$scope.platforms[i].code;
                }
            }*/
            $scope.searchByConditionDTO();
        };

        $scope.chosenRiskLevelName = '';
        $scope.setRiskLevel = function (index) {
            $scope.chosenRiskLevelName = $scope.riskLevels[index].name;
            $scope.conditionDTO.riskLevel = $scope.riskLevels[index].code;
            $scope.searchByConditionDTO();
        };

        $scope.chosenScenarioName = '';
        $scope.setScenario = function(index) {
            if(index==-1){
                $scope.chosenScenarioName = '全部';
                $scope.conditionDTO.scenarioInstanceName = '';
                $scope.conditionDTO.scenarioInstanceCode = '';
            } else {
                $scope.chosenScenarioName = $scope.scenarioInstanceDTOs[index].scenarioInstanceName;
                $scope.conditionDTO.scenarioInstanceName = $scope.scenarioInstanceDTOs[index].scenarioInstanceName;
                $scope.conditionDTO.scenarioInstanceCode = $scope.scenarioInstanceDTOs[index].scenarioInstanceCode;
            }
            $scope.searchByConditionDTO();
        };

        $scope.chosenRetName = '';
        $scope.setDealSolution = function (index){
            $scope.chosenRetName = $scope.dealSolutions[index].name;
            $scope.conditionDTO.retCode = $scope.dealSolutions[index].code;
            $scope.searchByConditionDTO();
        };

        // validate date; search by conditions if valid
        $scope.setDateRange = function() {
            $scope.timeType = '';
            $scope.tip_date = {invalid: false, info: ''};

            if(!$scope.conditionDTO.rightTime) {
                $scope.tip_date = { invalid: true, info: '请选择终止日期' };
            }
            else if(!$scope.conditionDTO.leftTime) {
                $scope.tip_date = { invalid: true, info: '请选择起始日期' };
            }
            // DELETE: invalid dates are disabled now
            else if ($scope.conditionDTO.leftTime > $scope.conditionDTO.rightTime) {
                $scope.tip_date = { invalid: true, info: '终止日期不能小于起始日期'};
            }
            else {
                $scope.tip_date = {invalid: false, info: ''};
                $scope.searchByConditionDTO();
            }
        };

        $scope.chosenDateRangeName = '';
        $scope.setDateRangeByCode = function (index) {
            $scope.chosenDateRangeName = $scope.dateRange[index].name;
            $scope.tip_date = {invalid: false, info: ''};
            $scope.timeType = $scope.dateRange[index].code;

            $scope.conditionDTO.leftTime = new Date();
            $scope.conditionDTO.rightTime = new Date();

            switch ($scope.dateRange[index].code)
            {
                case '':
                    // today
                    break;
                case 'oneWeek':
                    $scope.conditionDTO.leftTime.setDate($scope.conditionDTO.leftTime.getDate() - 6);   // last week
                    break;
                case 'oneMonth':
                    $scope.conditionDTO.leftTime.setMonth($scope.conditionDTO.leftTime.getMonth() - 1);  // last month
                    break;
                case 'threeMonth':
                    $scope.conditionDTO.leftTime.setMonth($scope.conditionDTO.leftTime.getMonth() - 3);  //last 3 months
                    break;
                default:
                // default as today
            }
            $scope.searchByConditionDTO();
        };

        var resetPage = function() {
            $scope.page = 1;
            //$scope.conditionDTO.pageSize = 5;
            $scope.conditionDTO.pageNumber = 1;
        };

        var resetSearchConditions = function() {
            $scope.timeType = 'threeMonth';
            $scope.conditionDTO.riskLevel = '';
            $scope.conditionDTO.retCode = '';
            $scope.conditionDTO.scenarioInstanceCode = '';
            $scope.conditionDTO.scenarioInstanceName = '';
        };

        //search all conditions
        $scope.searchByConditionDTO = function(){
            $scope.tip_keyword = {invalid: false, info: ''};   // clear keyword search tip
            $scope.keyword = '';   // clear keyword search field

            //if object is null ,do not
            if((Object.keys($scope.conditionDTO).length!=0)){
                resetPage();
                $scope.conditionDTO.pageNumber=1;
                $scope.conditionDTO.eventIdAndAccountId='';
                if($scope.conditionDTO.strategyInstance!=undefined){
                    //$scope.conditionDTO.strategyInstanceName=$scope.conditionDTO.strategyInstance.strategyInstanceName;
                    $scope.conditionDTO.strategyInstanceCode=$scope.conditionDTO.strategyInstance.strategyInstanceCode;
                }
                $scope.conditionDTO.pageNumber=$scope.page;
                $scope.conditionDTO.pageSize = $scope.pageSize;
                // if($scope.conditionDTO.dateRange!=''){
                //     $scope.conditionDTO.leftTime='';
                //     $scope.conditionDTO.rightTime='';
                // }
                $scope.queryPromise = searchByConditionDTO.query($scope.conditionDTO).then(function(result){

                    //console.log(result);
                    $scope.riskEvent.length=0;
                    $scope.links = ParseLinks.parse(result.headers('link'));
                    $scope.translateDealSolutionsAndRiskLevels(result.data.searchByConditionDTOs);
                    $scope.resultCount = result.data.riskEventCounts;
                });
            }
            else if(Object.keys($scope.conditionDTO).length === 0) {
                console.log('please input some conditions');
            }
        };

        // show search button when search field's focused
        $scope.showSearchBtn = function(event) {
            var inputField = angular.element(event.target),
                searchBtn = angular.element(event.target.nextElementSibling);

            // show search button
            searchBtn.removeClass('ud_hide');
            searchBtn.show();

            angular.element('body').bind('click', function(e){
                var targetElement = e.target;

                if(!(searchBtn.is(targetElement) || inputField.is(targetElement))) {
                    angular.element('body').unbind('click');
                    searchBtn.hide();
                }
            });
        };

        //query when user press ENTER key
        $scope.queryByKeywordWithEnterKey = function (event) {
            if(event.which === 13) {
                $scope.searchByKeyword();
                event.preventDefault();
            }
        };

        // fuzzy search by keyword (event ID or account ID)
        $scope.searchByKeyword = function () {
            resetPage();
            resetSearchConditions();

            if(!$scope.keyword) {
                $scope.tip_keyword = {invalid: true, info: '请输入事件ID或账户ID'};   // show tip if search field's blank

            } else {
                $scope.tip_keyword = {invalid: false, info: ''};   // clear keyword search field

                // search condition object of keyword searching
                var keywordCondition = {
                    'page-number': $scope.page,
                    'page-size': $scope.pageSize,
                    //'platform': $scope.conditionDTO.platform,
                    //'strategy-instance-code': $scope.conditionDTO.strategyInstance.strategyInstanceCode,
                    'keywords': $scope.keyword
                };

                $scope.queryPromise = RiskEvent.query(keywordCondition).then( function(response) {
                    $scope.riskEvent.length = 0;
                    $scope.links = ParseLinks.parse(response.headers('link'));

                    $scope.resultCount = response.data.riskEventCounts;
                    $scope.translateDealSolutionsAndRiskLevels(response.data.searchByConditionDTOs);
                    //console.log(response);
                });
            }
        };

        $scope.searchByScore = function() {
            resetPage();
            //searchByConditionDTO.query({leftScore:$scope.conditionDTO.leftScore,rightScore:$scope.conditionDTO.rightScore},function(result,headers){
            $scope.queryPromise = searchByConditionDTO.query($scope.conditionDTO).then(function(result){
                $scope.riskEvent.length=0;
                $scope.links = ParseLinks.parse(result.headers('link'));
                $scope.translateDealSolutionsAndRiskLevels(result.data);
            });
        };

        $scope.loadAll = function() {
            //初始化加载全部数据
            $scope.conditionDTO.pageNumber = $scope.page;
            $scope.conditionDTO.pageSize = $scope.pageSize;

            $scope.conditionDTO.leftTime = new Date();
            $scope.conditionDTO.rightTime = new Date();
            $scope.conditionDTO.leftTime.setDate($scope.conditionDTO.leftTime.getMonth() - 3);   // last 3 months

            $scope.queryPromise = searchByConditionDTO.query($scope.conditionDTO).then(function (result) {
                $scope.links = ParseLinks.parse(result.headers('link'));
                //数据为空的分页判断（待定）
                if($scope.links['last'] === 0){
                    $scope.page = 0;
                }
                $scope.translateDealSolutionsAndRiskLevels(result.data);
            });

            //console.log($scope.conditionDTO);
        };

        $scope.loadPage = function (page) {
            $scope.page = page;
            $scope.loadAll();
        };

        $scope.riskDetails = function (id, eventId) {
            $state.go('riskEventDetail', {id: id, eventId: eventId});
        };

        $scope.onClickSelector = function($event) {
            var ele = document.getElementsByClassName('condition-hover');
            [].forEach.call(ele, function(v){
                angular.element(v).addClass('condition').removeClass('condition-hover')
            });

            $event.stopPropagation();
            var parentEle = angular.element($event.target.parentElement);

            if(parentEle.hasClass('condition')) {
                parentEle.addClass('condition-hover').removeClass('condition');
            } else if(parentEle.hasClass('condition-hover')) {
                parentEle.addClass('condition').removeClass('condition-hover');
            }
            var bodyEle = document.getElementsByTagName('body');
            angular.element(bodyEle).bind("click", function(event){
                var ele = document.getElementsByClassName('condition-hover');
                [].forEach.call(ele, function(v){
                    angular.element(v).addClass('condition').removeClass('condition-hover')
                });
            });
        };

    });