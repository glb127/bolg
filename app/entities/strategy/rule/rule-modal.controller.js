'use strict';

angular.module('cloudxWebApp')

    .controller('CopyStrategyController', function ($scope, $uibModal, $uibModalInstance, serviceCode, apiStrategy,RuleInstance) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.strategyCopyName = serviceCode.name;
        $scope.strategyCopyID = serviceCode.id;
        $scope.ok = function () {
            if($scope.saveFlag){return;}
            $scope.saveFlag=true;
            apiStrategy.postCopy({strategyId:$scope.strategyCopyID}, function (result) {
                RuleInstance.selectStrategy()
                $uibModalInstance.close();
                $scope.saveFlag=false;
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'CopyStrategyOK.html',
                    controller: 'CopyStrategyOKController',
                    resolve: {
                        serviceCode: function () {
                            return result;
                        }
                    }
                });
            },function(){
                $scope.saveFlag=false;
            });
            
        };
    })
    .controller('CopyStrategyOKController', function ($scope,$state, $uibModalInstance, serviceCode) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.goStrategy = function (id) {
            $uibModalInstance.dismiss();
            $state.go("ruleCenter",{strategyId: id});
        };
        $scope.strategyCopyedName = serviceCode.name;
        $scope.strategyCopyedID = serviceCode.id;

    })

    .controller('CopyRuleController', function ($scope, $state, $uibModal, $uibModalInstance, serviceCode, apiStrategy,apiRule,RuleInstance) {
        
        $scope.strategyCopyID = $state.params.strategyId;
        $scope.ScenariosName = serviceCode.ScenariosName;
        $scope.SolutionsName = serviceCode.SolutionsName;
        $scope.RuleID = serviceCode.id;

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.ok = function () {
            if($scope.validate()){
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                var postObj = {
                  "strategyId": $scope.strategyCopyID,
                  "scenarioId": $scope.dataTmp.scenarioEnt.id,
                  "scenarioTypeCode": $scope.dataTmp.scenarioEnt.code,
                  "solutionId": $scope.dataTmp.solutionEnt.id,
                  "ruleId": $scope.RuleID 
                }
                apiRule.postCopy(postObj, function (result) {
                    RuleInstance.selectRules();
                    $uibModalInstance.close();
                    $scope.saveFlag=false;
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'CopyRuleOK.html',
                        controller: 'CopyRuleOKController',
                        resolve: {
                            serviceCode: function () {
                                result.ScenariosName=$scope.dataTmp.scenarioEnt.name;
                                result.SolutionsName=$scope.dataTmp.solutionEnt.name;
                                return result;
                            }
                        }
                    });
                },function(){
                    $scope.saveFlag=false;
                });
            }
        };

        $scope.dataTmp={};
        $scope.init = function () {
            //场景列表
            apiStrategy.getScenariosSolutions({strategyId :$scope.strategyCopyID},function(data){
                $scope.dataTmp.scenarioList = data;
                // if($scope.dataTmp.scenarioList.length>0){
                //     $scope.dataTmp.scenarioEnt = $scope.dataTmp.scenarioList[0];
                //     $scope.changeScenario();
                // }else{
                //     $scope.dataTmp.scenarioEnt = "";
                //     $scope.dataTmp.solutionList={};
                //     $scope.dataTmp.solutionEnt="";
                // }
            });
        }        
        $scope.changeScenario = function () {
            $scope.dataTmp.solutionList={};
            for(var i=$scope.dataTmp.scenarioList.length;i--;){
                if($scope.dataTmp.scenarioEnt.id == $scope.dataTmp.scenarioList[i].id && $scope.dataTmp.scenarioList[i].solutions){
                    $scope.dataTmp.solutionList = $scope.dataTmp.scenarioList[i].solutions;
                    break;
                }
            }
            // if($scope.dataTmp.solutionList.length>0){
            //     $scope.dataTmp.solutionEnt = $scope.dataTmp.solutionList[0];
            // }else{
            //     $scope.dataTmp.solutionEnt = "";
            // }
        }
        $scope.init();


        //验证场景
        $scope.validate_scenario = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.dataTmp.scenarioEnt) {
                $scope.tip_scenario = {invalid: true, info: '请选择所属场景'};
            } else {
                $scope.tip_scenario = {invalid: false, info: ''};
            }
            return !$scope.tip_scenario.invalid;
        };
        //验证锦囊
        $scope.validate_solution = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.dataTmp.solutionEnt) {
                $scope.tip_solution = {invalid: true, info: '请选择所属锦囊'};
            } else {
                $scope.tip_solution = {invalid: false, info: ''};
            }
            return !$scope.tip_solution.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight =  $scope.validate_scenario() & $scope.validate_solution();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };
    })
    .controller('CopyRuleOKController', function ($scope, $timeout, $uibModalInstance, serviceCode) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
            $timeout.cancel(time);
        };
        var time = $timeout(function() {
            $uibModalInstance.dismiss();
        },3000);
        $scope.ScenariosName = serviceCode.ScenariosName;
        $scope.SolutionsName = serviceCode.SolutionsName;

    })

    .controller('DeleteRuleController', function ($scope, $uibModal, $uibModalInstance, serviceCode, apiRule,RuleInstance) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.ruleName = serviceCode.name;
        $scope.ruleId = serviceCode.id;
        $scope.ok = function () {
            if($scope.saveFlag){return;}
            $scope.saveFlag=true;
            apiRule.deleteId({ruleId:$scope.ruleId}, function (result) {
                RuleInstance.selectRules();
                $uibModalInstance.close();
                $scope.saveFlag=false;
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'MessageModal.html',
                    controller: 'MessageModalController',
                    resolve: {
                        serviceCode: function () {
                            return {
                                message:"删除成功！"
                            };
                        }
                    }
                });
            },function(){
                $scope.saveFlag=false;
            });
            
        };
    })

    .controller('DeletePredicatorController', function ($scope, $uibModal, $uibModalInstance, serviceCode, apiPredicator,RuleInstance) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.name = serviceCode.name;
        $scope.id = serviceCode.id;
        $scope.ok = function () {
            if($scope.saveFlag){return;}
            $scope.saveFlag=true;
            apiPredicator.deleteId({predicatorId:$scope.id}, function (result) {
                RuleInstance.selectPredicators();
                $uibModalInstance.close();
                $scope.saveFlag=false;
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'MessageModal.html',
                    controller: 'MessageModalController',
                    resolve: {
                        serviceCode: function () {
                            return {
                                message:"删除成功！"
                            };
                        }
                    }
                });
            },function(){
                $scope.saveFlag=false;
            });
            
        };
    })

    .controller('CantDeletePredicatorController', function ($scope, $timeout, $uibModalInstance, serviceCode) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
            $timeout.cancel(time);
        };
        var time = $timeout(function() {
            $uibModalInstance.dismiss();
        },3000);
        var ruleName="";    
        for(var ent in serviceCode.usedRules){
            ruleName+=serviceCode.usedRules[ent]+"、"
        }
        if(ruleName!=""){
            ruleName=ruleName.substr(0,ruleName.length-1);
        }
        var predicatorName="";
        for(var ent in serviceCode.usedPredicators){
            predicatorName+=serviceCode.usedPredicators[ent]+"、"
        }
        if(predicatorName!=""){
            predicatorName=predicatorName.substr(0,predicatorName.length-1);
        }
        $scope.ruleName = ruleName;
        $scope.predicatorName = predicatorName;
        $scope.optionType = serviceCode.type;

    })