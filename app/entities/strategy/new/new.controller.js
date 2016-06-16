'use strict';

angular.module('cloudxWebApp')
    .controller('StrategyCreateStep1Controller', function ($scope, $state, sessionData, Strategy, MerchantTypes, previousState, apiStrategy) {

        //跳转判断是否初始化
        if (previousState == 'createStrategyStep2'||previousState == 'createStrategyStep3') {
            $scope.sessionData = sessionData.get();
            if($scope.sessionData.code){
               $scope.needInitData = false; 
            }else{
                $scope.needInitData = true;
            }
        }
        else {
            $scope.sessionData = {};
            $scope.needInitData = true;
        }

        //初始获取参数
        $scope.initStrategyInfo = function () {
            //攻略名称·
            $scope.sessionData.name = '';
            //获取攻略ID
            apiStrategy.postCode({}, function (data) {
                $scope.sessionData.code = data.code;
            });
            //平台下拉框初始化
            $scope.sessionData.platformsList = [
                {'code': '0', 'name': 'ios'},
                {'code': '1', 'name': 'android'},
                {'code': '2', 'name': 'web'}
            ];
            //$scope.sessionData.platformEnt = $scope.sessionData.platformsList[0];
            //行业下拉框初始化
            apiStrategy.getIndustries({}, function (data) {
                $scope.sessionData.industriesList = data;
                //$scope.sessionData.industrieEnt = $scope.sessionData.industriesList[0];
            });
            //选择创建形式初始化
            apiStrategy.getUserTemplates({}, function (data) {
                $scope.sessionData.createTypeList = data;
                $scope.sessionData.createTypeList.push( {'id': '-1', 'name': '不使用模板'})
                $scope.sessionData.createTypeID = $scope.sessionData.createTypeList[0].id;
            });
  
        };
        //是否初次登录
        if($scope.needInitData){
            $scope.initStrategyInfo();
        }
        var resetTips = function() {
            $scope.tip_name = {invalid: false, info: ''};
            $scope.tip_code = {invalid: false, info: ''};
            $scope.tip_platform = {invalid: false, info: ''};
            $scope.tip_industrie = {invalid: false, info: ''};
            $scope.tip_all = {invalid: false, info: ''};            
        };
        resetTips();

        // 选择创建形式
        $scope.checkCreateType = function (ID) {
            $scope.sessionData.createTypeID = ID;           
        };


        $scope.saveAndNext = function () {
            if ($scope.validate()) {
                sessionData.set($scope.sessionData);

                if($scope.sessionData.createTypeID==-1){ 
                    //自定义                   
                    $state.go('createStrategyStep3');
                }else{
                    $state.go('createStrategyStep2');
                }
            }            
        };

        $scope.close = function () {
            $state.go('strategyCenter');
        };
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
                apiStrategy.getName({name:$scope.sessionData.name}, function (data) {
                    if (data.result==0) {
                        $scope.tip_name = {invalid: false, info: ''};
                    } else {
                        $scope.tip_name = {invalid: true, info: '攻略名称不能重复'};
                    }
                });
            }
            return !$scope.tip_name.invalid;
        };

        //验证攻略ID
        $scope.validate_code = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var codePattern = new RegExp("[^A-z0-9_]");
            var getBLen = function(str) {
                if (str == null) return 0;
                if (typeof str != "string"){str += "";}
                return str.replace(/[^x00-xff]/g,"01").length;
            }
            if ($scope.sessionData.code === '') {
                $scope.tip_code = {invalid: true, info: '攻略ID不能为空'};
            } else if(codePattern.test($scope.sessionData.code)) {
                $scope.tip_code = {invalid: true, info: '攻略ID仅支持大小写字母、数字、下划线'};
            } else if (getBLen($scope.sessionData.code)>20||getBLen($scope.sessionData.code)<2) {
                $scope.tip_code = {invalid: true, info: '攻略ID字符长度为2-20'};
            } else {
                apiStrategy.getCode({code:$scope.sessionData.code}, function (data) {
                    if (data.result==0) {
                        $scope.tip_code = {invalid: false, info: '攻略ID用于技术对接，在攻略创建完成后不可修改'};
                    } else {
                        $scope.tip_code = {invalid: true, info: '攻略ID不能重复'};
                    }
                });
            }
            return !$scope.tip_code.invalid;
        };
        //验证平台
        $scope.validate_platform = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.sessionData.platform) {
                $scope.tip_platform = {invalid: true, info: '请选择应用平台'};
            } else {
                $scope.tip_platform = {invalid: false, info: ''};
            }
            return !$scope.tip_platform.invalid;
        };
        //验证行业
        $scope.validate_industrie = function () {
            $scope.tip_all = {invalid: false, info: ''};

            if (!$scope.sessionData.industrieEnt) {
                $scope.tip_industrie = {invalid: true, info: '请选择行业'};
            } else {
                $scope.tip_industrie = {invalid: false, info: ''};
            }
            return !$scope.tip_industrie.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_name() & $scope.validate_code() & $scope.validate_platform() & $scope.validate_industrie();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };
    })
    .controller('StrategyCreateStep2Controller', function ($scope, $state, $compile, sessionData, Strategy, previousState, apiStrategy) {

        if (!previousState) {
            $state.go('createStrategyStep1');
            return;
        }
        if (previousState == 'createStrategyStep1') {
            $scope.sessionData = sessionData.get();
        }
        $scope.sessionData = sessionData.get();

        if(!$scope.sessionData.scenarios 
                || $scope.sessionData._strategyId != $scope.sessionData.createTypeID
                || $scope.sessionData._industryId != $scope.sessionData.industrieEnt.id){
            $scope.sessionData.scenarios = [];
            apiStrategy.getUserTemplatesbId({
                    strategyId : $scope.sessionData.createTypeID,
                    industryId : $scope.sessionData.industrieEnt.id
                },function(data){
                    $scope.sessionData.scenarios = data;
                    $scope.sessionData._strategyId = $scope.sessionData.createTypeID;
                    $scope.sessionData._industryId = $scope.sessionData.industrieEnt.id;
                    $scope.getTableShowList();
                }
            );
        }

        //增加checked属性
        $scope.fillIsSelected2Checked = function () {
            var num2bool = function(num){
                if(num=="1"){
                    return true;
                }else{
                    return false;
                }
            }
            var _tmpScenarios = $scope.sessionData.scenarios;
            if(_tmpScenarios){
                for(var i1=0;i1<_tmpScenarios.length;i1++){ 
                    _tmpScenarios[i1].checked = num2bool(_tmpScenarios[i1].isSelected);
                    var _tmpSolutions = _tmpScenarios[i1].solutions;
                    if(_tmpSolutions){
                        for(var i2=0;i2<_tmpSolutions.length;i2++){
                            _tmpSolutions[i2].checked = num2bool(_tmpSolutions[i2].isSelected);
                            var _tmpRules = _tmpSolutions[i2].rules;
                            if(_tmpRules){
                                for(var i3=0;i3<_tmpRules.length;i3++){
                                    _tmpRules[i3].checked = num2bool(_tmpRules[i3].isSelected);
                                }
                            }
                        }
                    }
                }
            }
        }
        //通过checked属性得到selected
        $scope.fillChecked2IsSelected = function () {
            var bool2num = function(bool){
                if(bool==true){
                    return "1";
                }else{
                    return "0";
                }
            }
            var _tmpScenarios = $scope.sessionData.scenarios;
            if(_tmpScenarios){
                for(var i1=0;i1<_tmpScenarios.length;i1++){ 
                    _tmpScenarios[i1].isSelected = bool2num(_tmpScenarios[i1].checked);
                    var _tmpSolutions = _tmpScenarios[i1].solutions;
                    if(_tmpSolutions){
                        for(var i2=0;i2<_tmpSolutions.length;i2++){
                            _tmpSolutions[i2].isSelected = bool2num(_tmpSolutions[i2].checked);
                            var _tmpRules = _tmpSolutions[i2].rules;
                            if(_tmpRules){
                                for(var i3=0;i3<_tmpRules.length;i3++){
                                    _tmpRules[i3].isSelected = bool2num(_tmpRules[i3].checked);
                                }
                            }
                        }
                    }
                }
            }
        }
        //将三阶数组平铺
        $scope.getTableShowList = function () {
            $scope.fillIsSelected2Checked();
            $scope.sessionData.allRuleList = [];
            var _tmpScenarios = $scope.sessionData.scenarios;
            var emptyRule = {
                "id" : 0,
                "name" : ""
            }
            if(!_tmpScenarios){_tmpScenarios=[]; }
            for(var i1=0;i1<_tmpScenarios.length;i1++){                
                var _tmpScenariosRow = 0;
                var _tmpScenariosRowIndex = $scope.sessionData.allRuleList.length;
                var _tmpSolutions = _tmpScenarios[i1].solutions;
                if(_tmpSolutions && _tmpSolutions.length){
                    for(var i2=0;i2<_tmpSolutions.length;i2++){
                        var _tmpSolutionsRowIndex = $scope.sessionData.allRuleList.length;               
                        var _tmpRules = _tmpSolutions[i2].rules;
                        if(_tmpRules && _tmpRules.length){
                            _tmpScenariosRow +=_tmpRules.length;
                            for(var i3=0;i3<_tmpRules.length;i3++){
                                $scope.sessionData.allRuleList.push(_tmpRules[i3]);
                                
                                $scope.sessionData.allRuleList[$scope.sessionData.allRuleList.length-1].ScenariosIndex = i1;
                                $scope.sessionData.allRuleList[$scope.sessionData.allRuleList.length-1].SolutionsIndex = i2;
                            }  
                            $scope.sessionData.allRuleList[_tmpSolutionsRowIndex].SolutionsRow = _tmpRules.length;
                            $scope.sessionData.allRuleList[_tmpSolutionsRowIndex].SolutionsName = _tmpSolutions[i2].name;                          
                        } else {
                            _tmpScenariosRow+=1;
                            var _tmpEmptyRule = angular.copy(emptyRule);
                            _tmpEmptyRule.SolutionsRow = 1;
                            _tmpEmptyRule.SolutionsName = _tmpSolutions[i2].name;
                            _tmpEmptyRule.ScenariosIndex = i1;
                            _tmpEmptyRule.SolutionsIndex = i2;
                            $scope.sessionData.allRuleList.push(_tmpEmptyRule);  
                        }
                    }
                    $scope.sessionData.allRuleList[_tmpScenariosRowIndex].ScenariosRow = _tmpScenariosRow;
                    $scope.sessionData.allRuleList[_tmpScenariosRowIndex].ScenariosName = _tmpScenarios[i1].name;
                } else {
                    var _tmpEmptyRule = angular.copy(emptyRule);
                    _tmpEmptyRule.ScenariosRow = 1;
                    _tmpEmptyRule.ScenariosName = _tmpScenarios[i1].name;
                    _tmpEmptyRule.SolutionsRow = 1;
                    _tmpEmptyRule.SolutionsName = " ";//特殊
                    _tmpEmptyRule.ScenariosIndex = i1;
                    $scope.sessionData.allRuleList.push(_tmpEmptyRule);
                }
            }
            return $scope.sessionData.allRuleList;
        };
        
        
        //选中联动
        $scope.changeScenario = function (rule) {
            $scope.tip_solution = {invalid: false, info: ''};    //提示文字置空
            var _tmpScenarios = $scope.sessionData.scenarios[rule.ScenariosIndex];
            var checked = _tmpScenarios.checked;
            if(_tmpScenarios.solutions){
                //如果选中/不选中某场景，该场景包含的所有锦囊全部变为选中/不选中
                for (var i = 0; i < _tmpScenarios.solutions.length; i++) {
                    var  _tmpSolutions = _tmpScenarios.solutions[i];
                    _tmpSolutions.checked = checked;
                    if(_tmpSolutions.rules){
                        for (var i1 = 0; i1 < _tmpSolutions.rules.length; i1++) {
                            _tmpSolutions.rules[i1].checked = checked;
                        }
                    }
                }
            }
        };        
        $scope.changeSolution = function (rule) {
            $scope.tip_solution = {invalid: false, info: ''};    //提示文字置空
            var _tmpScenarios = $scope.sessionData.scenarios[rule.ScenariosIndex];
            var _tmpSolutions = _tmpScenarios.solutions[rule.SolutionsIndex];
            var checked = _tmpSolutions.checked;

            if (checked) {
                _tmpScenarios.checked = checked;
            }
            if( _tmpSolutions.rules){
                for (var i = 0; i < _tmpSolutions.rules.length; i++) {
                    _tmpSolutions.rules[i].checked = checked;
                }
            }
        };
        $scope.changeRule = function (rule) {
            $scope.tip_solution = {invalid: false, info: ''};    //提示文字置空
            var _tmpScenarios = $scope.sessionData.scenarios[rule.ScenariosIndex];
            var checked = rule.checked;

            if (checked) {
                _tmpScenarios.checked = checked;
                _tmpScenarios.solutions[rule.SolutionsIndex].checked = checked;
            }
        }

        $scope.validate_solution = function () {
            var flag=false;
            var _tmpScenarios = $scope.sessionData.scenarios;
            if(_tmpScenarios){
                for(var i1=0;i1<_tmpScenarios.length;i1++){ 
                    var _tmpSolutions = _tmpScenarios[i1].solutions;
                    if(_tmpSolutions&&_tmpSolutions.length>0){
                        for(var i2=0;i2<_tmpSolutions.length;i2++){
                            if(_tmpSolutions[i2].checked){                               
                                flag=true;
                                break;
                            }
                        }
                    }
                }
            }
            if(flag){
                $scope.tip_solution = {invalid: false, info: ''};
            } else {
                $scope.tip_solution = {invalid: true, info: '至少选择一个锦囊'};
            }
            return !$scope.tip_solution.invalid;
        };

        $scope.previous = function () {
            $scope.fillChecked2IsSelected();
            $state.go('createStrategyStep1');
        };
        $scope.getPostScenarios = function () {
            var retScenarios=[];
            var _tmpScenarios = $scope.sessionData.scenarios;
            if(_tmpScenarios){
                for(var i1=0;i1<_tmpScenarios.length;i1++){ 
                    if(_tmpScenarios[i1].checked){
                        retScenarios.push({
                            id:_tmpScenarios[i1].id,
                            code:_tmpScenarios[i1].code
                        });
                        var _tmpSolutions = _tmpScenarios[i1].solutions;
                        if(_tmpSolutions&&_tmpSolutions.length>0){
                            var _tmpRsolutions = retScenarios[retScenarios.length-1].solutions=[];
                            for(var i2=0;i2<_tmpSolutions.length;i2++){
                                if(_tmpSolutions[i2].checked){
                                    _tmpRsolutions.push({
                                        id:_tmpSolutions[i2].id
                                    });
                                    var _tmpRules = _tmpSolutions[i2].rules;
                                    if(_tmpRules&&_tmpRules.length>0){
                                        _tmpRsolutions[_tmpRsolutions.length-1].rules=[];
                                        for(var i3=0;i3<_tmpRules.length;i3++){
                                            if(_tmpRules[i3].checked){
                                                _tmpRsolutions[_tmpRsolutions.length-1].rules.push({
                                                    id:_tmpRules[i3].id
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return retScenarios;
        }
        $scope.saveAndNext = function () {
            if ($scope.validate_solution()) {                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                $scope.fillChecked2IsSelected();
                var postObj={
                    "name": $scope.sessionData.name,
                    "code": $scope.sessionData.code,
                    "platform": $scope.sessionData.platform,
                    "industryId": $scope.sessionData.industrieEnt.id,
                    "templateId": $scope.sessionData.createTypeID,
                    "scenarios": $scope.getPostScenarios()
                }
                apiStrategy.postTemplate(postObj,function(result){
                    $state.go('createStrategyStep4', {strategyId: result.id, strategyName: result.name});
                    $scope.saveFlag=false;
                },function(){
                    $scope.saveFlag=false;
                })
            }
        };
    })

    .controller('StrategyCreateStep3Controller', function ($scope, $compile, $state, Strategy, previousState, sessionData, apiSolution, apiStrategy) {
        if (!previousState) {
            $state.go('createStrategyStep1');
        }

        $scope.sessionData = sessionData.get();
        if(!$scope.sessionData.scenarios 
                || $scope.sessionData._strategyId != $scope.sessionData.createTypeID
                || $scope.sessionData._industryId != $scope.sessionData.industrieEnt.id){
            $scope.sessionData.scenarios=[];
            apiSolution.getScenarioTypes({type:'2', industryId:$scope.sessionData.industrieEnt.id},function(data){
                $scope.sessionData.scenarios = data;
                $scope.sessionData._strategyId = $scope.sessionData.createTypeID;
                $scope.sessionData._industryId = $scope.sessionData.industrieEnt.id;
                $scope.fillIsSelected2Checked();
            })
        }
        //增加checked属性
        $scope.fillIsSelected2Checked = function () {
            var num2bool = function(num){
                if(num=="1"){
                    return true;
                }else{
                    return false;
                }
            }
            var _tmpScenarios = $scope.sessionData.scenarios;
            if(_tmpScenarios){
                for(var i1=0;i1<_tmpScenarios.length;i1++){ 
                    _tmpScenarios[i1].checked = num2bool(_tmpScenarios[i1].isSelected);
                }
            }
        }
        //通过checked属性得到selected
        $scope.fillChecked2IsSelected = function () {
            var bool2num = function(bool){
                if(bool==true){
                    return "1";
                }else{
                    return "0";
                }
            }
            var _tmpScenarios = $scope.sessionData.scenarios;
            if(_tmpScenarios){
                for(var i1=0;i1<_tmpScenarios.length;i1++){ 
                    _tmpScenarios[i1].isSelected = bool2num(_tmpScenarios[i1].checked);
                }
            }
        }
        $scope.previous = function () {
            $scope.fillChecked2IsSelected();
            $state.go('createStrategyStep1');
        };
        $scope.getPostScenarios = function () {
            var retScenarios=[];
            var _tmpScenarios = $scope.sessionData.scenarios;
            if(_tmpScenarios){
                for(var i1=0;i1<_tmpScenarios.length;i1++){ 
                    if(_tmpScenarios[i1].checked){
                        retScenarios.push({
                            id:_tmpScenarios[i1].id,
                            code:_tmpScenarios[i1].code
                        });
                    }
                }
            }
            return retScenarios;
        }
        $scope.saveAndNext = function () {
            if($scope.saveFlag){return;}
            $scope.saveFlag=true;
            var postScenarios = $scope.getPostScenarios();
            // if(postScenarios.length==0){
            //    $scope.tip_solution = {invalid: true, info: '至少选择一个场景'};
            //    return; 
            // }
            var postObj={
                "name": $scope.sessionData.name,
                "code": $scope.sessionData.code,
                "platform": $scope.sessionData.platform,
                "industryId": $scope.sessionData.industrieEnt.id,
                "scenarios": postScenarios
            }
            apiStrategy.post(postObj,function(result){
                $state.go('createStrategyStep4', {strategyId: result.id, strategyName: result.name});
                $scope.saveFlag=false;
            },function(){
                $scope.saveFlag=false;
            });
        };
    })

    .controller("StrategyCreateStep4Controller", function ($scope, $state, $stateParams, $timeout, previousState) {
        if (!previousState) {
            $state.go('createStrategyStep1');
        }

        $scope.strategyName = $stateParams.strategyName;
        $scope.strategyId = $stateParams.strategyId;
        var time = $timeout(function() {
            $state.go('ruleCenter', {strategyId: $scope.strategyId});
        },3000);
        $scope.closeTimeOut  = function(){
            $timeout.cancel( time );
        }

    })

    .controller("StrategyCreateStep5Controller", function ($scope, sessionData, $uibModal, $uibModalInstance) {
        $scope.sessionData = sessionData;
        for (var i = 0; i < $scope.sessionData.scenarios.length; i++) {
            for (var j = 0; j < $scope.sessionData.scenarios[i].solutions.length; j++) {
                var check = $scope.sessionData.scenarios[i].solutions[j].check;
                for (var k = 0; k < $scope.sessionData.scenarios[i].solutions[j].rules.length; k++) {
                    $scope.sessionData.scenarios[i].solutions[j].rules[k].check = check;
                }

            }
        }

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };

        $scope.previous = function () {
            $uibModalInstance.close();

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                templateUrl: 'app/entities/strategy/new/new_step_4.html',
                controller: 'StrategyCreateStep4Controller',
                resolve: {
                    sessionData: function () {
                        return $scope.sessionData;
                    }
                }
            });
        };

        $scope.saveAndFinish = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                templateUrl: 'app/entities/strategy/new/new_step_6.html',
                controller: 'StrategyCreateStep6Controller',
                resolve: {
                    sessionData: function () {
                        return $scope.sessionData;
                    }
                }
            });
            $uibModalInstance.close(modalInstance);

        };

    })

    .controller("StrategyCreateStep6Controller", function ($scope, $compile, sessionData, Strategy, $state, $uibModal, $uibModalInstance, saveNewStrategyService) {

        $scope.sessionData = sessionData;
        $scope.load_flag = true;


        $scope.saveAndFinish = function () {
            $scope.load_flag = false;
            var tmpArray = [];

            // 删除platform冗余字段
            for (var i = 0; i < $scope.sessionData.platforms.length; i++) {
                if ($scope.sessionData.platforms[i].check == true) {
                    $scope.sessionData.platforms[i].check = undefined;
                    tmpArray.push($scope.sessionData.platforms[i]);
                }
            }
            $scope.sessionData.platforms = tmpArray;

            // 删除scenario, solution, rule的冗余字段
            for (var i = 0; i < $scope.sessionData.scenarios.length; i++) {
                for (var j = 0; j < $scope.sessionData.scenarios[i].solutions.length; j++) {
                    tmpArray = [];
                    if ($scope.sessionData.scenarios[i].solutions[j].check == false) {
                        $scope.sessionData.scenarios[i].solutions[j].rules = [];
                    }
                    delete $scope.sessionData.scenarios[i].solutions[j].check;
                    delete $scope.sessionData.scenarios[i].solutions[j].show;
                    for (var k = 0; k < $scope.sessionData.scenarios[i].solutions[j].rules.length; k++) {
                        if ($scope.sessionData.scenarios[i].solutions[j].rules[k].check == true) {
                            delete $scope.sessionData.scenarios[i].solutions[j].rules[k].check;
                            delete $scope.sessionData.scenarios[i].solutions[j].rules[k].solution;
                            tmpArray.push($scope.sessionData.scenarios[i].solutions[j].rules[k]);
                        }
                    }
                    $scope.sessionData.scenarios[i].solutions[j].rules = tmpArray;
                }
            }
            // console.log(strategy);
            // console.log(strategyConfiguration);

            // set the strategy
            var toSaveStrategy = {
                "code": $scope.sessionData.code,

                "name": $scope.sessionData.name,

                "decisionPolicy": "1",

                "blockScore": $scope.sessionData.blockScore,

                "riskLevelDefinitions": $scope.sessionData.riskLevelDefinitions,

                "strategyTemplateCode": $scope.sessionData.strategyTemplateCode,

                "scenarios": [],

                "platforms": $scope.sessionData.platforms
            };

            for (var i = 0; i < $scope.sessionData.scenarios.length; i++) {
                var tmpObj = {
                    "name": $scope.sessionData.scenarios[i].name,
                    "scenarioTemplateCode": $scope.sessionData.scenarios[i].scenarioTemplateCode,
                    "solutions": []
                };
                toSaveStrategy.scenarios.push(tmpObj);
                for (var j = 0; j < $scope.sessionData.scenarios[i].solutions.length; j++) {
                    tmpObj = {
                        "name": $scope.sessionData.scenarios[i].solutions[j].name,
                        "solutionTempalteCode": $scope.sessionData.scenarios[i].solutions[j].solutionTempalteCode,
                        "rules": []
                    };
                    toSaveStrategy.scenarios[i].solutions.push(tmpObj);
                    for (var k = 0; k < $scope.sessionData.scenarios[i].solutions[j].rules.length; k++) {
                        tmpObj = {
                            "name": $scope.sessionData.scenarios[i].solutions[j].rules[k].name,
                            "ruleTemplateCode": $scope.sessionData.scenarios[i].solutions[j].rules[k].ruleTemplateCode
                        };
                        toSaveStrategy.scenarios[i].solutions[j].rules.push(tmpObj);
                    }
                }
            }


            Strategy.save(toSaveStrategy).then(function (result) {//, function(result){
                //console.log(result);
                $scope.load_flag = true;
                $uibModalInstance.close();
                if (result.data == true) {
                    $state.go("ruleCenter", {strategyCode: $scope.sessionData.code});
                }
                else if (result.data == false) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        backdrop: "static",
                        templateUrl: 'app/entities/strategy/new/new_fail_msg.html',
                        controller: 'newFailMsgController'
                    });
                }
            });
        };

        $scope.previous = function () {
            $uibModalInstance.close();

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                templateUrl: 'app/entities/strategy/new/new_step_5.html',
                controller: 'StrategyCreateStep5Controller',
                resolve: {
                    sessionData: function () {
                        return $scope.sessionData;
                    }
                }
            });

        };

    });
