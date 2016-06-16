'use strict';

angular.module('cloudxWebApp')
    .controller('MainController', function ($scope, $http,$timeout,$q,$interval, $uibModal, $state,Principal,Top10BlockRule,Top10HitRule,RiskEventStatistics,RiskLevelStatistics) {

        //top 10 block rules function
        $scope.findBlockRules = function() {
            $scope.ruleBlockCountDTOs=[];
            Top10BlockRule.get({},function(result,headers){
                for(var i=0;i<result.length;i++){
                     $scope.ruleBlockCountDTOs.push(result[i]);
                }
            })
        };

        //top 10 hit rules function
        $scope.findHitRules = function(){
            $scope.ruleHitCountDTOs=[];
            Top10HitRule.get({},function(result,headers){
                for(var i=0;i<result.length;i++){
                    $scope.ruleHitCountDTOs.push(result[i]);
                }
            })

        };

        //risk event statistics function
        $scope.findRiskEventStatistics = function(){
            $scope.riskEventStatisticsDTOs=[];
            RiskEventStatistics.get({},function(result,headers){
                for(var i=0;i<result.length;i++){
                    $scope.riskEventStatisticsDTOs.push(result[i]);
                }
                for(var i=0;i<$scope.riskEventStatisticsDTOs.length;i++){
                    if($scope.riskEventStatisticsDTOs[i].retCode=='0000'){
                        $scope.riskEventStatisticsDTOs[i].method='放行';
                    }
                    else if($scope.riskEventStatisticsDTOs[i].retCode=='9999'){
                        $scope.riskEventStatisticsDTOs[i].method='阻止';
                    }
                }
            })
        };

        //risk level statistics function
        $scope.findRiskLevelStatistics = function(){
            $scope.riskLevelStatisticsDTOs=[];
            RiskLevelStatistics.get({},function(result,headers){
                for(var i=0;i<result.length;i++){
                    $scope.riskLevelStatisticsDTOs.push(result[i]);
                }
                for(var i=0;i<$scope.riskLevelStatisticsDTOs.length;i++){
                    if($scope.riskLevelStatisticsDTOs[i].riskLevel=="0"){
                        $scope.riskLevelStatisticsDTOs[i].riskLevelName="极低风险";
                    }
                    else if($scope.riskLevelStatisticsDTOs[i].riskLevel=="1"){
                        $scope.riskLevelStatisticsDTOs[i].riskLevelName="低风险";
                    }
                    else if($scope.riskLevelStatisticsDTOs[i].riskLevel=="2"){
                        $scope.riskLevelStatisticsDTOs[i].riskLevelName="中风险";
                    }
                    else if($scope.riskLevelStatisticsDTOs[i].riskLevel=="3"){
                        $scope.riskLevelStatisticsDTOs[i].riskLevelName="高风险";
                    }
                    else if($scope.riskLevelStatisticsDTOs[i].riskLevel=="4"){
                        $scope.riskLevelStatisticsDTOs[i].riskLevelName="极高风险";
                    }
                }
            })
        };
        //riskevent and riskLevel $interval task
        $scope.riskEventAndRiskLevelTimeInterval = function () {

                //Initialize the Timer to run every 1000 milliseconds i.e. one second.
                var intervalPromise=$interval(function() {
                   //find risk event statistics per 5mins
                   $scope.findRiskEventStatistics();
                   //find risk Level statistics per 5mins
                   $scope.findRiskLevelStatistics();
                }, 300000);
                //destory interval if change page
                $scope.$on('$destroy', function () { $interval.cancel(intervalPromise); });

            };

        //hitRule and blockRule $interval task
        $scope.hitRulesAndBlockRulesTimeInterval = function(){
            var intervalPromise=$interval(function() {
                   //find top 10 block rules per 1 hour
                   $scope.findBlockRules();
                   //find top 10 hit rules per 1 hour
                   $scope.findHitRules();
                }, 3600000);
            //destory interval if change page
            $scope.$on('$destroy', function () { $interval.cancel(intervalPromise); });
        };

        $scope.checkDetail = function (ruleInstanceCode,strategyInstanceId) {
            $state.go("ruleDetail", {id:ruleInstanceCode,strategyId:strategyInstanceId});
        };

        $scope.hitRulesAndBlockRulesTimeInterval();
        $scope.riskEventAndRiskLevelTimeInterval();
        $scope.findBlockRules();
        $scope.findHitRules();
        $scope.findRiskEventStatistics();
        $scope.findRiskLevelStatistics();
        //$scope.AppCtrl();
    });

angular.module('cloudxWebApp')
    .controller('mainAddController', function ($scope, $uibModalInstance, aValue, allCard) {
        $scope.modalShowIdArray = aValue;   //未添加的widget的id，由dashboard中的modalInstance传来
        $scope.allCardsurls = allCard;      //所有widget，由dashboard中的modalInstance传来
        $scope.addIdArray = [];             //
        $scope.modalShowCardsurls = queryNewCard();     //获取所有未添加的模型
        $scope.checkbox=[];     //flag数组：标记所有widget是否选中
        //初始化checkbox，默认为不选中
        for(var i=0; i<$scope.modalShowCardsurls.length; i++){
            $scope.checkbox.push(false);
        }

        //点击保存按钮，传回被选中widget的ID并关闭modal窗口
        $scope.ok = function () {
            //获取所有被选中widget
            for(var i=0; i<$scope.modalShowCardsurls.length; i++){
                if($scope.checkbox[i]==true)
                    $scope.addIdArray.push($scope.modalShowIdArray[i]);
            }
            //传回被选中的widget
            $uibModalInstance.close($scope.addIdArray);
        };


        //点击取消按钮，关闭modal窗口
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        function queryNewCard() {
            var cardsArray = new Array();
            for (var i = 0; i < $scope.modalShowIdArray.length; i++) {
                //根据相应的showIdArray找出要显示的
                var temp = new Object();
                temp.url = findUrl($scope.modalShowIdArray[i]);
                temp.id = $scope.modalShowIdArray[i];
                cardsArray.push(temp);
            }
            return cardsArray;
        }

        function findUrl(id) {
            for (var i = 0; i < $scope.allCardsurls.length; i++) {
                if (id == $scope.allCardsurls[i].id) {
                    return $scope.allCardsurls[i].url
                }
            }
            return null;
        }
    });
