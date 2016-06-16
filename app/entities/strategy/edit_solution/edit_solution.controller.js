'use strict';

angular.module('cloudxWebApp')
    .controller('EditSolutionController', function ($scope,$state,$stateParams,$q,$rightSlideDialog,apiStrategy,apiSolution,RuleInstance) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.type  = $stateParams.type;
        if(!$scope.type){
            $state.go("ruleCenter");
            return;
        }
        $scope.editOldName = "";
        if($scope.type=="new"){
            $scope.title = "添加锦囊";
            $scope.scenarioId = $stateParams.scenarioId;
        }else if($scope.type=="edit"){
            $scope.title = "设置锦囊";
            $scope.scenarioId = $stateParams.scenarioId;
            $scope.solutionId = $stateParams.solutionId;
        }
        $scope.evaluationList=[{id:"0",name:"最坏匹配"},{id:"1",name:"求和模式"}]
        $scope.close = function(){
            $rightSlideDialog.close('edit_solution');
        }
        $scope.save = function(){
            if ($scope.validate()) {
                $scope.sessionData.strategyId = $scope.strategyId;
                if($scope.type=="new"){
                    $scope.sessionData.id = "";
                }else{
                    $scope.sessionData.solutionId = $scope.sessionData.id;
                }
                $scope.sessionData.pointRight=$scope.sessionData.pointRight+"";
                $scope.sessionData.pointLeft=$scope.sessionData.pointLeft+"";
                if(!$scope.needCheck){
                    $scope.sessionData.pointRight = $scope.sessionData.pointOnly;
                    $scope.sessionData.pointLeft = $scope.sessionData.pointOnly;
                }
                $scope.sessionData.riskTypeId = $scope.dataTmp.riskEnt.id;
                $scope.sessionData.scenarioId = $scope.dataTmp.scenarioEnt.id;
                $scope.sessionData.oldScenarioId = $scope.scenarioId;
                if($scope.dataTmp.templateEnt!=-1){
                    $scope.sessionData.fromSolutionId = $scope.dataTmp.templateEnt;
                }else{
                    $scope.sessionData.fromSolutionId = null;
                }                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="edit"){
                    apiSolution.putId($scope.sessionData,function(result){
                        RuleInstance.selectRules();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    apiSolution.post($scope.sessionData,function(result){
                        RuleInstance.selectRules();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
                

            }
            
        }
        //改变是否参与决策
        $scope.changeIsPolicy = function(value){
            $scope.sessionData.isPolicy= value;
            if(value=='1'){
                $scope.needCheck=true;
            }
            $scope.sessionData.pointLeft=30;
            $scope.sessionData.pointRight=60;
            $scope.sessionData.pointOnly=60;
        }
        //改变是否风险阈值
        $scope.changeNeedCheck = function(value){
            $scope.needCheck = value;
            if(value){
                $scope.sessionData.pointLeft=30;
                $scope.sessionData.pointRight=60;
            }else{
                $scope.sessionData.pointOnly=60;
            }
        }
        
        $scope.sessionData = {
            "id":"",
            "name":"",
            "riskTypeId":"",
            "scenarioId":"",
            "fromSolutionId":"",
            "evaluation": "0",
            "isPolicy": "0",
            "pointLeft": 30,
            "pointRight": 60,
            "pointOnly": 60            
        };
        $scope.needCheck = true;
        $scope.dataTmp = {};

        //初始获取参数
        $scope.init = function () {
            $q.all([apiSolution.getScenarioTypes({type:'1', strategyId :$scope.strategyId}).$promise,
                    apiStrategy.getId({strategyId:$scope.strategyId}).$promise,
                    apiSolution.getTemplates({}).$promise])
            .then(function(data){
                $scope.dataTmp.scenarioList=data[0];
                if($scope.scenarioId){
                    for(var i=$scope.dataTmp.scenarioList.length;i--;){
                        if($scope.scenarioId==$scope.dataTmp.scenarioList[i].id){
                            $scope.dataTmp.scenarioEnt = $scope.dataTmp.scenarioList[i];
                            break;
                        }
                    }
                }
                $scope.industryId=data[1].industryId;
                $scope.dataTmp.templateList = data[2].concat({id:-1,name:"不选择模板"});

                apiSolution.getRiskTypes({ industryId :$scope.industryId},function(data){
                    $scope.dataTmp.riskList = data.concat({id:"",name:"不选择风险类型"});
                    if($scope.type=="edit"){
                        $scope.getInfo();;
                    }
                });
            
            });

            
        };

        //修改锦囊时获取锦囊数据
        $scope.getInfo = function () {
            apiSolution.getId({solutionId:$scope.solutionId,strategyId :$scope.strategyId},function (data) {
                $scope.sessionData = data;
                $scope.editOldName = $scope.sessionData.name;
                if($scope.sessionData.isPolicy==1){
                    $scope.sessionData.pointLeft=$scope.sessionData.pointRight;
                    $scope.sessionData.pointOnly=$scope.sessionData.pointLeft;
                }else{
                    $scope.sessionData.pointOnly=$scope.sessionData.pointLeft;
                }
                $scope.needCheck = ($scope.sessionData.pointLeft!=$scope.sessionData.pointRight);
                var catchFlag=false;
                for(var i=$scope.dataTmp.scenarioList.length;i--;){
                    if($scope.sessionData.scenarioId==$scope.dataTmp.scenarioList[i].id){
                        $scope.dataTmp.scenarioEnt = $scope.dataTmp.scenarioList[i];
                        catchFlag=true;
                        break;
                    }
                }
                if(!catchFlag){
                    $scope.dataTmp.scenarioEnt = $scope.dataTmp.scenarioList[0];
                }
                catchFlag=false;
                for(var i=$scope.dataTmp.riskList.length;i--;){
                    if($scope.sessionData.riskTypeId==$scope.dataTmp.riskList[i].id){
                        $scope.dataTmp.riskEnt = $scope.dataTmp.riskList[i];
                        catchFlag=true;
                        break;
                    }
                }
                if(!catchFlag){
                    $scope.dataTmp.riskEnt = $scope.dataTmp.riskList[$scope.dataTmp.riskList.length-1];
                }
                if($scope.sessionData.fromSolutionId== $scope.solutionId){
                    $scope.dataTmp.templateEnt = -1;
                }else{
                    $scope.dataTmp.templateEnt = $scope.sessionData.fromSolutionId;
                }
            });
            
        };
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
        //验证锦囊名称
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            var getBLen = function(str) {
                if (str == null) return 0;
                if (typeof str != "string"){str += "";}
                return str.replace(/[^x00-xff]/g,"01").length;
            }
            if(!$scope.dataTmp.scenarioEnt){
                $scope.tip_name = {invalid: true, info: '请先选择所属场景'};
            }else if ($scope.sessionData.name === '') {
                $scope.tip_name = {invalid: true, info: '锦囊名称不能为空'};
            } else if (!namePattern.test($scope.sessionData.name)) {
                $scope.tip_name = {invalid: true, info: '锦囊名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            } else if (getBLen($scope.sessionData.name)>20||getBLen($scope.sessionData.name)<2) {
                $scope.tip_name = {invalid: true, info: '锦囊名称字符长度为2-20'};
            } else {
                if($scope.type=="edit" && $scope.editOldName==$scope.sessionData.name && $scope.dataTmp.scenarioEnt.id == $scope.scenarioId){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiSolution.getName({scenarioId:$scope.dataTmp.scenarioEnt.id, name:$scope.sessionData.name}, function (data) {
                        if (data.isSame==0) {
                            $scope.tip_name = {invalid: false, info: ''};
                        } else {
                            $scope.tip_name = {invalid: true, info: '锦囊名称不能重复'};
                        }
                    });
                }
            }
            return !$scope.tip_name.invalid;
        };
        //验证风险类型
        $scope.validate_risk = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.dataTmp.riskEnt) {
                $scope.tip_risk = {invalid: true, info: '请选择风险类型'};
            } else {
                $scope.tip_risk = {invalid: false, info: ''};
            }
            return !$scope.tip_risk.invalid;
        };
        //验证模板
        $scope.validate_template = function () {
            $scope.tip_all = {invalid: false, info: ''};

            if (!$scope.dataTmp.templateEnt) {
                $scope.tip_template = {invalid: true, info: '请选择锦囊模板'};
            } else {
                $scope.tip_template = {invalid: false, info: ''};
            }
            return !$scope.tip_template.invalid;
        };
        //验证风险阈值
        $scope.validate_threshold = function () {
            $scope.tip_all = {invalid: false, info: ''};
            function isPInt(str) {
                var g = /^[1-9]*[1-9][0-9]*$/;
                return g.test(str);
            }
            if($scope.needCheck){
                if (!$scope.sessionData.pointLeft || !$scope.sessionData.pointRight) {
                    $scope.tip_threshold = {invalid: true, info: '请输入阈值'};
                } else if (!isPInt($scope.sessionData.pointLeft) || !isPInt($scope.sessionData.pointRight)) {
                    $scope.tip_threshold = {invalid: true, info: '阈值必须是正整数'};
                } else if ($scope.sessionData.pointLeft-0 >= $scope.sessionData.pointRight-0) {
                    $scope.tip_threshold = {invalid: true, info: '阈值1必须小于阈值2'};
                } else {
                    $scope.tip_threshold = {invalid: false, info: ''};
                }
            }else{
                if (!$scope.sessionData.pointOnly) {
                    $scope.tip_threshold = {invalid: true, info: '请输入阈值'};
                } else if (!isPInt($scope.sessionData.pointOnly)) {
                    $scope.tip_threshold = {invalid: true, info: '阈值必须是正整数'};
                } else {
                    $scope.tip_threshold = {invalid: false, info: ''};
                }
            }
            return !$scope.tip_threshold.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_scenario() & $scope.validate_name() & $scope.validate_risk() & $scope.validate_template() & $scope.validate_threshold();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };
        
    });
