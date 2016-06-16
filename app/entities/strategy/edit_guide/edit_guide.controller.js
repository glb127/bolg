'use strict';

angular.module('cloudxWebApp')
    .controller('EditGuideController', function ($scope,$state,$stateParams,$rightSlideDialog,apiStrategy,MerchantTypes,apiSolution,RuleInstance) {
        $scope.strategyId = $stateParams.strategyId;

        $scope.close = function(){
            $rightSlideDialog.close('edit_guide');
        }
        $scope.save = function(){
            if($scope.validate()){
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
                    "name": $scope.sessionData.name,
                    "platform": $scope.sessionData.platform,
                    "industryId": $scope.sessionData.industryId,
                    "scenarios": requestScenarios
                }
                apiStrategy.putId(requestObj,function(result){
                    RuleInstance.getStrategyInfo();
                    $scope.close();
                })
            }
        }
        //删除攻略
        $scope.clickStrategyDelete = function(){

        }
        $scope.showAddScenariosFlag = false;
        //显示可添加场景
        $scope.toggleAddScenarios = function(){
            $scope.showAddScenariosFlag = !$scope.showAddScenariosFlag;
        }
        //获取可添加场景列表
        $scope.getScenariosOther = function(){
            apiSolution.getScenarioTypes({type:'0', strategyId :$scope.strategyId},function(data){
                $scope.scenariosOther = data;
            });
        }
        $scope.changeScenario = function(ent){
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
        //行业改变
        $scope.changeIndustrie = function(index){
            $scope.getScenariosOther();
        }
        //初始获取参数
        $scope.init = function () {
            //平台下拉框初始化
            $scope.platformsList = [
                {'code': '0', 'name': 'ios'},
                {'code': '1', 'name': 'android'},
                {'code': '2', 'name': 'web'}
            ];
            apiStrategy.getId({strategyId:$scope.strategyId},function (data) {
                $scope.sessionData = data;
                $scope.oldName=$scope.sessionData.name;
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
        $scope.init();

        //验证攻略名称
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            var getBLen = function(str) {
                if (str == null) return 0;
                if (typeof str != "string"){str += "";}
                return str.replace(/[^x00-xff]/g,"01").length;
            }
            if ($scope.sessionData.name === '') {
                $scope.tip_name = {invalid: true, info: '攻略名称不能为空'};
            } else if (!namePattern.test($scope.sessionData.name)) {
                $scope.tip_name = {invalid: true, info: '攻略名称仅支持中文、大小写字母、数字、下划线'};
            } else if (getBLen($scope.sessionData.name)>20||getBLen($scope.sessionData.name)<2) {
                $scope.tip_name = {invalid: true, info: '攻略名称字符长度为2-20'};
            } else {
                if($scope.oldName==$scope.sessionData.name){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiStrategy.getName({name:$scope.sessionData.name}, function (data) {
                        if (data.result==0) {
                            $scope.tip_name = {invalid: false, info: ''};
                        } else {
                            $scope.tip_name = {invalid: true, info: '攻略名称不能重复'};
                        }
                    });
                }
            }
            return !$scope.tip_name.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_name() ;
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };
    });
