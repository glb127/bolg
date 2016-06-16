'use strict';

angular.module('cloudxWebApp')
    .controller('RuleController', function ($q, $timeout, $scope, $state, $compile, $uibModal,  ParseLinks, $stateParams,
                                            getRuleInstanceListService, getSearchPropertiesService, ruleDetailService,
                                            StrategyConfiguration, MerchantTypes, strategyProperty, updateRuleInstanceStatusService,
                                            ErrorTipModal,ruleInstanceList, apiStrategy, apiParameter,apiPredicator,RuleInstance,apiRule) 
    {


        //1:规则 2:指标 3:请求字段
        
        $scope.strategyId = $state.params.strategyId;
        $scope.gridType = $state.params.tag||1;

        $scope.selectTmp={};
        $scope.selectTmp.selectTypesList1 = [{id:1,name:"规则名称"},{id:2,name:"字段"}];
        $scope.selectTmp.selectType1 = 1;
        $scope.selectTmp.keyword1 = "";
        $scope.selectTmp.selectTypesList2 = [{id:1,name:"指标名称"},{id:2,name:"字段"}];
        $scope.selectTmp.selectType2 = 1;
        $scope.selectTmp.keyword2 = "";
        $scope.selectTmp.keyword3 = "";

        $scope.tFilter={};
        $scope.tFilter.scoreIndex = 0;
        $scope.tFilter.statusIndex = 0;
        $scope.tFilter.scoreLeft = "";
        $scope.tFilter.scoreRight = "";
        $scope.tFilter.scopeIndex = 0;
        $scope.tFilter.scenarioIndex = 0;
        $scope.tFilter.dimensionIndex = 0;
        $scope.tFilter.typeIndex = 0;

        $scope.showScenarioList=[];        
        $scope.showSolutionList=[];

        $scope.scopeMap = ["本攻略","本商户",""];
        $scope.fieldQueryList = function(ent){
            return $scope.selectTmp.keyword1 && (ent.fieldName.indexOf($scope.selectTmp.keyword1)>-1 || ent.displayName.indexOf($scope.selectTmp.keyword1)>-1)
        }

        //获取该攻略的所有属性（名称，code, id，包含场景等等，为搜索做准备）
        $scope.getStrategyInfo = function () {
            //获取所有攻略列表
            $scope.selectStrategy();
            //字段维度
            apiParameter.getTags({},function(data){
                $scope.dimensionList = data;
            });
            
            //字段类型
            apiParameter.getValueTypes({},function (data) {
                $scope.typeList = data;
            });
            //规则列表 查询
            $scope.selectRules();
            //指标列表 查询
            $scope.selectPredicators();
            //请求字段列表 查询
            $scope.selectParameters();
        };
        RuleInstance.getStrategyInfo = $scope.getStrategyInfo;

        //获取所有攻略列表
        $scope.selectStrategy = function(){
             //获取所有攻略            
            apiStrategy.get({},function(data){
                $scope.strategyList=data;
                if($scope.strategyId){
                    for(var i=0;i<$scope.strategyList.length;i++){
                        if($scope.strategyList[i].id==$scope.strategyId){
                            $scope.strategyName = $scope.strategyList[i].name;
                            break;
                        }
                    }
                }
            });
        }
        RuleInstance.selectStrategy = $scope.selectStrategy;
        //规则列表 查询
        $scope.selectRules = function(){
            $scope.tFilter.scoreIndex = 0;
            $scope.tFilter.statusIndex = 0;            
            $scope.tFilter.scoreLeft = "";
            $scope.tFilter.scoreRight = "";
            var _type = 0;
            var _key = $scope.selectTmp.keyword1;
            if(_key != ""){
                _type = $scope.selectTmp.selectType1;
            }
            if(_type==2){
                _key = $scope.selectTmp.keyword1.id;
            }
            apiStrategy.getRules({type:_type, key:_key, strategyId :$scope.strategyId},function(data){
                $scope.scenarioList = data;
                $scope.getTableShowRule();
            });
        }
        RuleInstance.selectRules = $scope.selectRules;
        //指标列表 查询
        $scope.selectPredicators = function(){            
            $scope.tFilter.statusIndex = 0;
            $scope.tFilter.scopeIndex = 0;
            var _type = 0;
            var _key = $scope.selectTmp.keyword2;
            if(_key != ""){
                _type = $scope.selectTmp.selectType2;
            }
            if(_type==2){
                _key = $scope.selectTmp.keyword2.id;
            }
            apiPredicator.get({keywordType:_type, keyword:_key, strategyId :$scope.strategyId},function(data){
                $scope.predicatorList = data;
            });
        }
        RuleInstance.selectPredicators = $scope.selectPredicators;
        //请求字段列表 查询
        $scope.selectParameters = function(){
            $scope.tFilter.scenarioIndex = 0;
            $scope.tFilter.dimensionIndex = 0;
            $scope.tFilter.typeIndex = 0;
            //请求字段
            apiStrategy.getParameters({strategyId :$scope.strategyId},function(data){
                $scope.parameterList = data;
                $scope.getTableShowParameter();
            });
        }
        $scope.queryTypeChange1 = function(e){
            $scope.selectTmp.keyword1="";
        }
        $scope.queryTypeChange2 = function(e){
            $scope.selectTmp.keyword2="";
        }
        $scope.queryByEnterKey1 = function(e){
            if(e.charCode==13){
                $scope.selectRules();
            }
        }
        $scope.queryByEnterKey2 = function(e){
            if(e.charCode==13){
                $scope.selectPredicators();
            }
        }
        $scope.queryByEnterKey3 = function(e){
            if(e.charCode==13){
                $scope.parameterFilerChange();
            }
        }
        $scope.changeGridType = function(_gridType){
            $scope.gridType=_gridType;
            if($scope.gridType==1){
                $scope.selectTmp.keyword1='';
                $scope.selectRules();
            }else if($scope.gridType==2){
                $scope.selectTmp.keyword2='';
                $scope.selectPredicators();
            }else if($scope.gridType==3){
                $scope.selectTmp.keyword3='';
                $scope.selectParameters();
            }
            angular.element(".rmn_content_normal").scrollTop(0);
        }

        $scope.clickDropdownInput = function($event){
            $event.stopPropagation();
        }
        //将规则列表三阶数组铺平成一阶
        
        $scope.getTableShowRule = function () {
            $scope.allRuleList = [];            
            $scope.showScenarioList=[];        
            $scope.showSolutionList=[];
            var _tmpScenarios = $scope.scenarioList;
            var emptyRule = {
                "id" : 0,
                "name" : "",
                "isShow" : false
            }
            if(!_tmpScenarios){_tmpScenarios=[]; }
            for(var i1=0;i1<_tmpScenarios.length;i1++){
                var _tmpSolutions = _tmpScenarios[i1].solutions;
                if(_tmpSolutions && _tmpSolutions.length){
                    for(var i2=0;i2<_tmpSolutions.length;i2++){               
                        var _tmpRules = _tmpSolutions[i2].rules;
                        if(_tmpRules && _tmpRules.length){
                            for(var i3=0;i3<_tmpRules.length;i3++){
                                $scope.allRuleList.push(_tmpRules[i3]);                                
                                $scope.allRuleList[$scope.allRuleList.length-1].ScenariosId = _tmpScenarios[i1].id;
                                $scope.allRuleList[$scope.allRuleList.length-1].SolutionsId = _tmpSolutions[i2].id;
                                $scope.allRuleList[$scope.allRuleList.length-1].isShow = false;
                                $scope.allRuleList[$scope.allRuleList.length-1].ScenariosName = _tmpScenarios[i1].name;
                                $scope.allRuleList[$scope.allRuleList.length-1].SolutionsName = _tmpSolutions[i2].name;
                            }                      
                        } else {
                            var _tmpEmptyRule = angular.copy(emptyRule);
                            _tmpEmptyRule.ScenariosName = _tmpScenarios[i1].name;
                            _tmpEmptyRule.SolutionsName = _tmpSolutions[i2].name;
                            _tmpEmptyRule.ScenariosId = _tmpScenarios[i1].id;
                            _tmpEmptyRule.SolutionsId = _tmpSolutions[i2].id;
                            $scope.allRuleList.push(_tmpEmptyRule);   
                        }
                    }                
                } else {
                    var _tmpEmptyRule = angular.copy(emptyRule);
                    _tmpEmptyRule.ScenariosName = _tmpScenarios[i1].name;
                    _tmpEmptyRule.ScenariosId = _tmpScenarios[i1].id;
                    $scope.allRuleList.push(_tmpEmptyRule);
                }
            }
            $scope.getRuleRow();
        };
        $scope.getRuleRow = function () {
            var _scenarioPre=0,
                _scenarioRow=0,
                _solutionPre=0,
                _solutionRow=0;
            for(var i=0;i<$scope.allRuleList.length;i++){
                $scope.allRuleList[i].showSolution =false;
                $scope.allRuleList[i].showScenario =false;
                if($scope.allRuleList[i].SolutionsId&&$scope.allRuleList[i].SolutionsId==($scope.allRuleList[i+1]&&$scope.allRuleList[i+1].SolutionsId)){
                    if($scope.allRuleList[i].isShow){
                        _solutionRow++;
                    }
                }else{
                    if($scope.allRuleList[i].isShow){
                        _solutionRow++;
                    }
                    if(_solutionRow==0){
                        _solutionRow = 1;
                    }else{
                        for(var i1=_solutionPre;i1<=i;i1++){
                            if($scope.allRuleList[i1].isShow){
                                _solutionPre=i1;
                                break;
                            }
                        }
                    }
                    $scope.allRuleList[_solutionPre].showSolution =true;
                    $scope.allRuleList[_solutionPre].solutionRow = _solutionRow;
                    _solutionPre = i+1;
                    _scenarioRow+=_solutionRow;                        
                    _solutionRow=0;
                }

                if($scope.allRuleList[i].ScenariosId==($scope.allRuleList[i+1]&&$scope.allRuleList[i+1].ScenariosId)){
                 
                }else{
                    if(_scenarioRow==0){
                        _solutionRow = 1;
                    }else{
                        var _tmp_scenarioPre = _scenarioPre;
                        for(var i1=_scenarioPre;i1<=i;i1++){
                            if(i1>_tmp_scenarioPre&&$scope.allRuleList[i1].SolutionsId!=($scope.allRuleList[i1-1]&&$scope.allRuleList[i1-1].SolutionsId)){
                                break;
                            }
                            if($scope.allRuleList[i1].isShow){
                                _scenarioPre=i1;
                                break;
                            }
                        }
                    }
                    $scope.allRuleList[_scenarioPre].showScenario =true;
                    $scope.allRuleList[_scenarioPre].scenarioRow = _scenarioRow;
                    _scenarioPre = i+1;
                    _scenarioRow=0;
                }
            }
            
            $scope.allStatus="0";
            for(var i=0;i<$scope.allRuleList.length;i++){
                if($scope.allRuleList[i].isShow&&$scope.allRuleList[i].status=="1"){
                    $scope.allStatus="1";
                    break;
                }
            }
        
        }
        $scope.showEmptyLine = function(rule){
            return !rule.isShow&&rule.showSolution;
        }
        $scope.showRuleTr = function(ent){
            return ent.isShow||ent.showScenario||ent.showSolution;
        }
        $scope.ngShowRule = function(ent){
            return ent.isShow;
        }

        //将字段二阶数组铺平成一阶
        $scope.getTableShowParameter = function () {
            $scope.allParameterList = [];
            var _tmpScenarios = $scope.parameterList;
            var emptyRule = {
                "fieldName" : "",
                "isShow" : true
            }
            if(!_tmpScenarios){_tmpScenarios=[]; }
            for(var i1=0;i1<_tmpScenarios.length;i1++){
                var _tmpSolutions = _tmpScenarios[i1].parameters;
                if(_tmpSolutions && _tmpSolutions.length){
                    for(var i2=0;i2<_tmpSolutions.length;i2++){                        
                        $scope.allParameterList.push(_tmpSolutions[i2]);
                        $scope.allParameterList[$scope.allParameterList.length-1].ScenariosName = _tmpScenarios[i1].scenarioName;
                        $scope.allParameterList[$scope.allParameterList.length-1].ScenariosCode = _tmpScenarios[i1].scenarioTypeCode;
                        $scope.allParameterList[$scope.allParameterList.length-1].isShow = true;
                    }
                } else {
                    var _tmpEmptyRule = angular.copy(emptyRule);
                    _tmpEmptyRule.ScenariosName = _tmpScenarios[i1].scenarioName;
                    _tmpEmptyRule.ScenariosCode = _tmpScenarios[i1].scenarioTypeCode;
                    $scope.allParameterList.push(_tmpEmptyRule);
                }
            }
            $scope.getParameterRow();
        }
        $scope.getParameterRow = function () {
            var _scenarioPre=0,
                _scenarioRow=0;
            for(var i=0;i<$scope.allParameterList.length;i++){
                $scope.allParameterList[i].showScenario =false;
                if($scope.allParameterList[i].scenarioId&&$scope.allParameterList[i].scenarioId==($scope.allParameterList[i+1]&&$scope.allParameterList[i+1].scenarioId)){
                    if($scope.allParameterList[i].isShow){
                        _scenarioRow++;
                    }
                }else{
                    if($scope.allParameterList[i].isShow){
                        _scenarioRow++;
                    }
                    if(_scenarioRow==0){
                        _scenarioRow = 1;
                    }else{
                        for(var i1=_scenarioPre;i1<=i;i1++){
                            if($scope.allParameterList[i1].isShow){
                                _scenarioPre=i1;
                                break;
                            }
                        }
                    }
                    $scope.allParameterList[_scenarioPre].showScenario = true;
                    $scope.allParameterList[_scenarioPre].scenarioRow = _scenarioRow;
                    _scenarioPre = i+1;                      
                    _scenarioRow = 0;
                }
            } 
        }
        $scope.showParameterTr = function(ent){
            return ent.isShow||ent.showScenario;
        }
        $scope.ruleFilerChange = function(){
            function isPInt(str) {
                var g = /^(0|[1-9]\d*)$/;
                return g.test(str);
            }
            for(var i=0;i<$scope.allRuleList.length;i++){
                var _isShow=true;
                if($scope.tFilter.scoreIndex != 0&&$scope.allRuleList[i].score!==undefined){
                    var _value = $scope.allRuleList[i].score.replace("+","");
                    if(isPInt($scope.tFilter.scoreLeft) && _value-0<$scope.tFilter.scoreLeft-0){
                        _isShow=false;
                    }
                    if(isPInt($scope.tFilter.scoreRight) && _value-0>$scope.tFilter.scoreRight-0){
                        _isShow=false;
                    }
                }
                if($scope.tFilter.statusIndex != 0 && $scope.allRuleList[i].status!=$scope.tFilter.statusIndex-1){
                    _isShow=false;
                }
                if($scope.showSolutionList.indexOf($scope.allRuleList[i].SolutionsId)==-1){
                    _isShow=false;
                }
                $scope.allRuleList[i].isShow = _isShow;
            }
            
            $scope.getRuleRow();
        }

        $scope.predicatorFilter = function (ent) {
            var flag = true;
            if($scope.tFilter.scopeIndex!=0&&$scope.tFilter.scopeIndex-1!=ent.scope){
                flag = false;
            }
            if($scope.tFilter.statusIndex!=0&&$scope.tFilter.statusIndex-1!=ent.status){
                flag = false;
            }
            return flag;
        };

        $scope.parameterFilerChange = function(){
            // $scope.tFilter.scenarioIndex = 0;
            // $scope.tFilter.dimensionIndex = 0;
            // $scope.tFilter.typeIndex = 0;

            for(var i=0;i<$scope.allParameterList.length;i++){
                var _isShow=true;
                if($scope.tFilter.typeIndex != 0
                    && $scope.allParameterList[i].type!=$scope.tFilter.typeIndex){
                    _isShow=false;
                }
                if($scope.tFilter.dimensionIndex != 0 
                    && $scope.allParameterList[i].dimension!=$scope.tFilter.dimensionIndex){
                    _isShow=false;
                }
                if($scope.selectTmp.keyword3 != "" 
                    && $scope.allParameterList[i].fieldName.indexOf($scope.selectTmp.keyword3)==-1
                    && $scope.allParameterList[i].displayName.indexOf($scope.selectTmp.keyword3)==-1){
                    _isShow=false;
                }
                $scope.allParameterList[i].isShow = _isShow;
            }
            $scope.getParameterRow();
        }

        //场景增加锦囊
        $scope.addSolution =function(rule){
            $state.go("editSolution",{type:"new",scenarioId:rule.ScenariosId});
        }
        //编辑锦囊
        $scope.editSolution =function(rule){
            $state.go("editSolution",{type:"edit",scenarioId:rule.ScenariosId,solutionId:rule.SolutionsId});
        }
        //锦囊增加规则
        $scope.addrule =function(rule){
            $state.go("newRuleStep1",{solutionId:rule.SolutionsId,scenarioId:rule.ScenariosId});
        }
        //修改场景显示与否
        $scope.changScenarioShow=function(rule){
            var _index = $scope.showScenarioList.indexOf(rule.ScenariosId);
            if(_index>-1){
                $scope.showScenarioList.splice(_index,1);
                for(var i=0;i<$scope.scenarioList.length;i++){
                    if($scope.scenarioList[i].id==rule.ScenariosId){
                        for(var i1=$scope.scenarioList[i].solutions.length;i1--;){
                            var _sonindex = $scope.showSolutionList.indexOf($scope.scenarioList[i].solutions[i1].id);
                            if(_sonindex>-1){
                                $scope.showSolutionList.splice(_sonindex,1);
                            }
                        }
                    }
                }
            }else{
                $scope.showScenarioList.push(rule.ScenariosId);
                for(var i=0;i<$scope.scenarioList.length;i++){
                    if($scope.scenarioList[i].id==rule.ScenariosId){
                        for(var i1=$scope.scenarioList[i].solutions.length;i1--;){
                            var _sonindex = $scope.showSolutionList.indexOf($scope.scenarioList[i].solutions[i1].id);
                            if(_sonindex==-1){
                                $scope.showSolutionList.push($scope.scenarioList[i].solutions[i1].id);
                            }
                        }
                    }
                }
            }
            $scope.ruleFilerChange();
        } 
        //修改锦囊显示与否
        $scope.changSolutionShow=function(rule){
            var _index = $scope.showSolutionList.indexOf(rule.SolutionsId);
            if(_index>-1){
                $scope.showSolutionList.splice(_index,1);
            }else{
                $scope.showSolutionList.push(rule.SolutionsId)
            }
            $scope.ruleFilerChange();
        } 
        //编辑规则
        $scope.editRule =function(rule){ 
            $scope.changeRuleNew(rule);
            $state.go("newRuleStep3",{type:"edit",solutionId:rule.SolutionsId,scenarioId:rule.ScenariosId,ruleId:rule.id});
        }
        
        //复制规则
        $scope.copyRule = function (ent) {
            $scope.changeRuleNew(ent);
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'CopyRule.html',
                controller: 'CopyRuleController',
                resolve: {
                    serviceCode: function () {
                        return ent;
                    }
                }
            });
        };
        //删除规则
        $scope.deleteRule = function (ent) {
            $scope.changeRuleNew(ent);
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'DeleteRule.html',
                controller: 'DeleteRuleController',
                resolve: {
                    serviceCode: function () {
                        return ent;
                    }
                }
            });
        };
        //批量修改规则
        $scope.changeAllRuleStatus = function (ent) {
            if($scope.saveFlag){return;}
            $scope.saveFlag=true;
            if($scope.allStatus==1){
                $scope.allStatus=0;
            }else{
                $scope.allStatus=1;
            }
            var idList = [];
            for(var i=0;i<$scope.allRuleList.length;i++){
                if($scope.allRuleList[i].isShow&&$scope.allRuleList[i].id){
                    //$scope.changeRuleNew($scope.allRuleList[i]);
                    if($scope.allRuleList[i].isNew=="0"){
                        $scope.allRuleList[i].isNew="1";
                    }
                    idList.push($scope.allRuleList[i].id);
                }
            }
            apiRule.putAllStatus({strategyId :$scope.strategyId,ruleList :idList,status:$scope.allStatus},function(data){
                for(var i=0;i<$scope.allRuleList.length;i++){
                    if($scope.allRuleList[i].isShow){
                        $scope.allRuleList[i].status=$scope.allStatus;
                    }
                }
                $scope.saveFlag=false;
            },function(){
                $scope.saveFlag=false;
            })
        };
        //启用规则
        $scope.changeRuleStatus = function (ent) {
            if($scope.saveFlag){return;}
            $scope.saveFlag=true;
            //$scope.changeRuleNew(ent);
            if(ent.isNew=="0"){
                ent.isNew="1";
            }
            if(ent.status==1){
                ent.status=0;
            }else{
                ent.status=1;
            }
            apiRule.putStatus({ruleId :ent.id,status:ent.status},function(data){
                $scope.saveFlag=false;
            },function(){
                $scope.saveFlag=false;
            })
        };
        //启用指标
        $scope.changePredicatorStatus = function (ent) {
            if($scope.saveFlag){return;}
            $scope.saveFlag=true;
            apiPredicator.putUsedStatus({strategyId:$scope.strategyId, predicatorId:ent.id},function(data){
                if(data.result=="1"){
                    if(ent.status==1){
                        ent.status=0;
                    }else{
                        ent.status=1;
                    }
                    apiPredicator.putStatus({strategyId :$scope.strategyId,predicatorId:ent.id,status:ent.status},function(data){
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    })
                }else{
                    $scope.saveFlag=false;
                    data.type="修改状态";
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'CantDeletePredicator.html',
                        controller: 'CantDeletePredicatorController',
                        resolve: {
                            serviceCode: function () {
                                return data;
                            }
                        }
                    });
                    
                }
            },function(){
                $scope.saveFlag=false;
            });
            
        };
        
         //编辑指标
        $scope.editpredicator =function(ent){ 
            if(ent.type=="0"){
                $state.go("editPredicator",{type:"edit",predicatorId:ent.id});
            } else if(ent.type=="1"){
                $state.go("editPredicator1",{type:"edit",predicatorId:ent.id});
            } else if(ent.type=="2"){
                if(ent.calculationFactorType=="0"){
                    $state.go("editPredicator2",{type:"edit",predicatorId:ent.id});
                }else if(ent.calculationFactorType=="1"){
                    $state.go("editPredicator2_1",{type:"edit",predicatorId:ent.id});
                }else if(ent.calculationFactorType=="2"){
                    $state.go("editPredicator2_2",{type:"edit",predicatorId:ent.id});
                }
            } else if(ent.type=="3"){
                $state.go("editPredicator3",{type:"edit",predicatorId:ent.id});
            }
        }
        //删除指标
        $scope.deletePredicator = function (ent) {
            $scope._tmpDeletePredicator=ent;
            apiPredicator.putUsedStatus({strategyId:$scope.strategyId, predicatorId:ent.id},function(data){
                if(data.result=="1"){
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'DeletePredicator.html',
                        controller: 'DeletePredicatorController',
                        resolve: {
                            serviceCode: function () {
                                return $scope._tmpDeletePredicator;
                            }
                        }
                    });
                }else{
                    data.type="删除";
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'CantDeletePredicator.html',
                        controller: 'CantDeletePredicatorController',
                        resolve: {
                            serviceCode: function () {
                                return data;
                            }
                        }
                    });
                }
            });
            
        };
        $scope.createChooseList = ["添加规则","添加锦囊","添加场景"];
        //新建按钮
        $scope.clickCreateChoose = function (ent) { 
            if(ent=="添加规则"){         
                $state.go("newRuleStep1");
            } else if(ent=="添加锦囊"){
                $state.go("editSolution",{type:"new"});    
            } else if(ent=="添加场景"){
                $state.go("newScenario");    
            }   
        };
        //新建指标
        $scope.addParameter = function () {          
            $state.go("newPredicator");    
        };

        $scope.copyStrategy = function (ent) {            
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'CopyStrategy.html',
                controller: 'CopyStrategyController',
                resolve: {
                    serviceCode: function () {
                        return ent;
                    }
                }
            });
        };
        $scope.clickStrategyList = function (ent) {            
            $state.go('ruleCenter', {strategyId: ent.id,tag:$scope.gridType});
        };
        $scope.getParameterList = function(){
            apiParameter.getWithStatus({},function(data){
                $scope.parameterSelList = [];
                for(var i=0;i<data.length;i++){
                    $scope.parameterSelList.push({
                        name:data[i].name,
                        code:data[i].code,
                        id:data[i].id
                    });
                }
            })
        }
        $scope.changeRuleNew = function(rule){
            //return;
            if(rule.isNew=="0"&&rule.id){
                apiRule.postRuleNew({ruleId:rule.id},function(){
                    rule.isNew="1";
                })
            }
        }
        //载入页面时：
        $scope.init = function () {
            //获取当前攻略信息
            $scope.getStrategyInfo();
            $scope.getParameterList();            
        };
        $scope.init();


    })
    .factory('RuleInstance', function(){

        return {
            selectRules:angular.noop,
            selectPredicators:angular.noop,
            getStrategyInfo:angular.noop
        };

    })