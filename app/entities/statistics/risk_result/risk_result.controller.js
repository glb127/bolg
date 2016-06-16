'use strict';

angular.module('cloudxWebApp')
    .controller('RiskResultController', function ($scope, HitRuleDistribute,HitScenarioDistribute,StrategiesService) {

        $scope.StrategyList=[];
        $scope.riskRuleListResults=[];
        $scope.riskScenarioListResults=[];
        $scope.riskResultDTO={};
        $scope.distribution='';
        $scope.warnFlag=true;

        //时间选择范围
        $scope.selectTimes = [
            {'value': '1', 'name': '最近一周'},
            {'value': '2', 'name': '近一个月'},
            {'value': '3', 'name': '近三个月'}
        ];
        //分布选择范围
        $scope.distributions = [
            {'value': '0', 'name': '规则分布'},
            {'value': '1', 'name': '场景分布'}
        ];
        //默认时间范围选择为最近一周
        $scope.nowDate = new Date();
        $scope.beginDate = (new Date()).setDate($scope.nowDate.getDate()-6);
        $scope.endDate = $scope.nowDate;
        $scope.riskResultDTO.startTime = new Date($scope.beginDate);
        $scope.riskResultDTO.endTime = $scope.nowDate;

        //日历控件
        $scope.format = 'yyyy/MM/dd';
        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1,
            showWeeks: false,
            mixMode: 'day',
            maxMode: 'day'
        };

        $scope.openBeginDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened1 = true;
            $scope.opened2 = false;
            $scope.maxDate = new Date();
            $scope.minDate = new Date((new Date()).setMonth($scope.nowDate.getMonth()-3));
        };

        $scope.openEndDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened1 = false;
            $scope.opened2 = true;
            $scope.maxDate1 = new Date();
            $scope.minDate1 = $scope.beginDate;
        };

        $scope.validateDate = function() {
            $scope.tip_date = {invalid: false, info: ''};
            $scope.selectTimes.highlight = '';

            if(!$scope.endDate) {
                $scope.tip_date = { invalid: true, info: '请选择终止日期' };
            } else if(!$scope.beginDate) {
                $scope.tip_date = { invalid: true, info: '请选择起始日期' };
            } else if($scope.beginDate>$scope.endDate) {
                $scope.tip_date = { invalid: true, info: '起始日期不能大于终止日期，请重新选择' };
            } else {
                $scope.tip_date = {invalid: false, info: ''};
                $scope.getRiskResultStatisticsByStrategyAndTime();
            }
        };

        $scope.chosenStrategyName = '';
        //点击攻略触发方法
        $scope.setStrategy = function(Strategy) {
            $scope.chosenStrategyName = Strategy.name;
            $scope.riskResultDTO.strategyInstanceCode = Strategy.code;
            $scope.getHitDistribute($scope.distribution);
            //$scope.selectTimes.highlight = '1';
        };

        //搜索全部攻略
        $scope.searchStrategy = function() {
            $scope.getStrategisPromise = StrategiesService.getStrategies().then( function(result) {
                if(result.data.length===0) {
                    $scope.showStrategyList = false;
                }
                for (var i = 0; i < result.data.length; i++) {
                    $scope.StrategyList.push(result.data[i]);
                    $scope.showStrategyList = true;
                }
                //默认选择第一个攻略
                //$scope.riskResultDTO.strategyInstanceCode=$scope.StrategyList[0].code;
            });
        };
        $scope.searchStrategy();

        //规则分布
        $scope.getHitRuleList = function() {
            HitRuleDistribute.query($scope.riskResultDTO, function(result) {
                $scope.riskRuleListResults = [];
                for (var i = 0; i < result.length; i++) {
                    $scope.riskRuleListResults.push(result[i]);
                }
            });
        };

        //场景分布
        $scope.getRuleHitCountByScenarioList = function() {
            HitScenarioDistribute.query($scope.riskResultDTO, function(result) {
                $scope.riskScenarioListResults = [];
                for (var i = 0; i < result.length; i++) {
                    $scope.riskScenarioListResults.push(result[i]);
                }
            });
        };

        $scope.chosenDistributionName = '';
        //点击分布类型方法
        $scope.setDistribution = function(distribution) {
            $scope.chosenDistributionName = distribution.name;
            $scope.distribution = distribution.value;
            if(distribution.value == '0') {
                $scope.flag = false;
                $scope.warnFlag = false;
            } else if(distribution.value == '1') {
                $scope.flag = true;
                $scope.warnFlag = false;
            }

            //如果为没有攻略被选中，则默认选择第一个攻略，并查询；
            if(!$scope.riskResultDTO.strategyInstanceCode) {
                $scope.riskResultDTO.strategyInstanceCode = $scope.StrategyList[0].code;
                $scope.setStrategy($scope.StrategyList[0]);
            }
        };

        //根据分布类型发起对应的请求
        $scope.getHitDistribute = function(distribution) {
            if(distribution == '0') {
                $scope.getHitRuleList();
                $scope.flag = false;
                $scope.warnFlag = false;
            }else if(distribution == '1') {
                $scope.getRuleHitCountByScenarioList();
                $scope.flag = true;
                $scope.warnFlag = false;
            }
        };

        $scope.chosenDateRangeName = '';
        //选择框选择日期触发方法
        $scope.setDateRange = function (selectTime) {
            $scope.chosenDateRangeName = selectTime.name;
            var value = selectTime.value;
            $scope.selectTimes.highlight = value;
            $scope.beginDate = new Date();
            $scope.endDate = new Date();
            var nowDate = new Date();

            //1 最近一周,2 近一个月,3 近三个月
            switch(value)
            {
                case '1':
                    $scope.beginDate = (new Date()).setDate(nowDate.getDate()-7);
                    break;
                case '2':
                    $scope.beginDate = (new Date()).setMonth(nowDate.getMonth()-1);
                    break;
                case '3':
                    $scope.beginDate=(new Date()).setMonth(nowDate.getMonth()-3);
                    break;
                default:
                //;
            }

            $scope.riskResultDTO.startTime = new Date($scope.beginDate);
            $scope.riskResultDTO.endTime = $scope.endDate;
            $scope.getHitDistribute($scope.distribution);
        };

        //点击确定搜索方法
        $scope.getRiskResultStatisticsByStrategyAndTime = function() {
            var beginDate, endDate;
            if($scope.beginDate!==null && $scope.endDate!==null) {
                beginDate=$scope.beginDate;
                endDate=$scope.endDate;
            }
            $scope.riskResultDTO.startTime=beginDate;
            $scope.riskResultDTO.endTime=endDate;
            $scope.getHitDistribute($scope.distribution);
        };

        $scope.onClickSelector = function($event) {
            var ele = document.getElementsByClassName('condition-hover');
            [].forEach.call(ele, function(v){
                angular.element(v).addClass('condition').removeClass('condition-hover')
            });

            $event.stopPropagation();
            var parentEle = angular.element($event.currentTarget.parentElement);

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
