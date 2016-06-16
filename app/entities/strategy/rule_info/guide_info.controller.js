'use strict';

angular.module('cloudxWebApp')
    .controller('GuideInfoController', function ($scope,$state,$stateParams,$rightSlideDialog,apiStrategy,MerchantTypes,apiSolution) {
        $scope.strategyId = $stateParams.strategyId; 
        $scope.close = function(){
            $rightSlideDialog.close('guide_info');
        }
        $scope.save = function(){
            var list =angular.element('[dragular="dragularOptions"] label');
            var requestScenarios = [];
            for(var i=0;i<list.length;i++){
                var index = list.eq(i).attr("index");
                var _obj={};
                if(index.split("_")[0]==1){
                    _obj=$scope.scenarios[index.split("_")[1]]
                }else if(index.split("_")[0]==2){
                    _obj=$scope.scenariosOther[index.split("_")[1]]
                }
                if(_obj.id){
                    requestScenarios.push({
                        id : _obj.id,
                        code : _obj.code
                    })
                }
            }
            var requestObj={
                "strategyId" :$scope.strategyId,
                "name": $scope.name,
                "platform": $scope.platform,
                "industryId": $scope.industryId,
                "scenarios": requestScenarios
            }
            apiStrategy.putId(requestObj,function(result){
                $scope.close();
            })
            
        }
        $scope.showAddScenariosFlag = false;
        //显示可添加场景
        $scope.toggleAddScenarios = function(){
            $scope.showAddScenariosFlag = !$scope.showAddScenariosFlag;
        }
        //获取可添加场景列表
        $scope.getScenariosOther = function(){
            apiSolution.getScenarioTypes({type:'2', strategyId :$scope.strategyId, industryId:$scope.industryId},function(data){
                $scope.scenariosOther = data;
            });
        }
        $scope.changeScenario = function(scenario){
            
        }
        //行业改变
        $scope.changeIndustrie = function(index){
            $scope.getScenariosOther();
        }
        //初始获取参数
        $scope.init = function () {
            $scope.platformsList=['ios', 'android', 'web'];
            apiStrategy.getId({strategyId:$scope.strategyId},function (data) {
                $scope.code = data.code;
                $scope.name = data.name;
                $scope.templateName = data.templateName;
                $scope.platform = data.platform;
                $scope.industryId = data.industryId;
                $scope.getScenariosOther();
            });
            //行业下拉框初始化
            apiStrategy.getIndustries({strategyId:$scope.strategyId}, function (data) {
                $scope.industriesList = data;
                var isSelected = 0;
                for(var i=$scope.industriesList.length;i--;){
                    if($scope.industriesList[i].isSelected=="1"){
                        isSelected=1;
                        $scope.industrieEnt = $scope.industriesList[i];
                        break;
                    }
                }
                if(isSelected==0){
                    $scope.industrieEnt = $scope.industriesList[0];
                }
            });
            //已添加场景
            apiSolution.getScenarioTypes({type:'1', strategyId :$scope.strategyId},function(data){
                $scope.scenarios = data;
            });
            
        };
        $scope.init()
    });
