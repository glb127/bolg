'use strict';

angular.module('cloudxWebApp')
    .controller('NewScenarioController', function ($scope,$state,$stateParams,$rightSlideDialog,apiStrategy,MerchantTypes,apiSolution,RuleInstance) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.close = function(){
            $rightSlideDialog.close('new_scenario');
        }
        $scope.save = function(){
            var list =angular.element('[dragular="dragularOptions"] label');
            var requestScenarios = [];
            for(var i=0;i<list.length;i++){
                requestScenarios.push({
                    id : list.eq(i).attr("tid"),
                    code :list.eq(i).attr("tcode")
                });
            }
            var requestObj={
                "strategyId" :$scope.strategyId,
                "name": $scope.name,
                "platform": $scope.platform,
                "industryId": $scope.industryId,
                "scenarios": requestScenarios
            }
            apiStrategy.putId(requestObj,function(result){
                RuleInstance.selectRules();
                $scope.close();
            })
            
        }

        //初始获取参数
        $scope.init = function () {
            apiStrategy.getId({strategyId:$scope.strategyId},function (data) {
                $scope.code = data.code;
                $scope.name = data.name;
                $scope.templateName = data.templateName;
                $scope.platform = data.platform;
                $scope.industryId = data.industryId;
            });
            //已添加场景
            apiSolution.getScenarioTypes({type:'1', strategyId :$scope.strategyId},function(data){
                $scope.scenarios = data;
            });

            //可添加场景列表
            apiSolution.getScenarioTypes({type:'0', strategyId :$scope.strategyId},function(data){
                $scope.scenariosOther = data;
            });
            
        };
        $scope.init();
        $scope.changeScenario =function(ent) {
            var catchFlag = false;
            for(var i=0;i<$scope.scenarios.length;i++){
                if($scope.scenarios[i].id==ent.id){
                    $scope.scenarios.splice(i,1);
                    catchFlag=true;
                    break;
                }
            }
            if(!catchFlag){
                $scope.scenarios.push(ent);
            }
        }
    });
