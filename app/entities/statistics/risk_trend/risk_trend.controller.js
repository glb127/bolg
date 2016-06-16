'use strict';

angular.module('cloudxWebApp')
    .controller('RiskTrendController', function ($scope, RiskTrend, ParseLinks,StrategiesService) {
        $scope.StrategyList = [];
        $scope.page = 1;

        $scope.tip_date = {invalid: false, info: ''};
        //默认时间范围选择为最近一周
        $scope.nowDate = new Date();
        $scope.beginDate = (new Date()).setDate($scope.nowDate.getDate()-7);
        $scope.endDate = $scope.nowDate;
        $scope.riskTrendDTO = {
            'strategyInstanceCode':'',
            'startTime':new Date($scope.beginDate),
            'endTime':$scope.nowDate
        };
        $scope.selectTimes = {};
        $scope.selectTimes = [{'value':'1','name':'最近一周'}, {'value':'2','name':'近一个月'},{'value':'3','name':'近三个月'}];

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
            $scope.minDate = new Date(new Date().setMonth(new Date().getMonth()-6));
            $scope.maxDate =  new Date();
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
                $scope.getRiskTrendStatisticsByStrategyAndTime();
            }
        };

        $scope.reset = function() {
            $scope.riskTrends = [];
        };

        $scope.query = function() {
            $scope.queryPromise = RiskTrend.query($scope.riskTrendDTO, function(result) {
                $scope.reset();
                $scope.riskTrends = result;
            });
        };

        $scope.chosenStrategyName = '';
        //点击攻略
        $scope.setStrategy = function(Strategy) {
            if(!!Strategy) {
                $scope.chosenStrategyName = Strategy.name;
            }
            console.log(Strategy);
            angular.element('#strategyCondition').addClass('condition').removeClass('condition-hover');

            if(Strategy != ''){
                $scope.riskTrendDTO.strategyInstanceCode = Strategy.code;
            }
            $scope.query();
        };
        //搜索全部攻略
        $scope.searchStrategy = function(){
            $scope.getStrategisPromise = StrategiesService.getStrategies().then(function(result) {
                if(result.data.length == 0){
                    $scope.showStrategyList = false;
                }
                for (var i = 0; i < result.data.length; i++) {
                    $scope.StrategyList.push(result.data[i]);
                    $scope.showStrategyList = true;
                }
                //默认选择第一个攻略
                if($scope.StrategyList.length != 0){
                    $scope.riskTrendDTO.strategyInstanceCode = $scope.StrategyList[0].code;
                }
                $scope.selectTimes.highlight = '1';
                $scope.setStrategy('');
            });
        };
        $scope.searchStrategy();

        //选择框选择日期触发方法
        $scope.getRiskTrendStatisticsByStrategyAndSelectTime = function (selectTime) {
            $scope.tip_date = {invalid: false, info: ''};

            var value = selectTime.value;
            $scope.selectTimes.highlight = value;
            $scope.beginDate = new Date();
            $scope.endDate = new Date();
            var nowDate = new Date();

            //1 最近一周,2 近一个月,3 近三个月
            switch(value)
            {
                case '1':
                    $scope.beginDate = (new Date()).setDate(nowDate.getDate()-6);
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
            $scope.riskTrendDTO.startTime = new Date($scope.beginDate);
            $scope.riskTrendDTO.endTime = $scope.endDate;

            $scope.query();
        };
        
        //点击确定搜索触发方法
        $scope.getRiskTrendStatisticsByStrategyAndTime = function() {

            $scope.riskTrendDTO.startTime = new Date($scope.beginDate);
            $scope.riskTrendDTO.endTime = $scope.endDate;

            $scope.query();
        };

        /*$scope.onClick = function() {
            //angular.element(event.target.parentElement).addClass('condition-hover');
            //angular.element(event.target.parentElement).removeClass('condition');
            angular.element('#strategyCondition').addClass('condition-hover').removeClass('condition');

        };

        $scope.onMouseleave = function() {
            angular.element('#strategyCondition').addClass('condition').removeClass('condition-hover');
        };*/

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
