'use strict';

angular.module('cloudxWebApp')
    .controller('newRuleStep1Controller', function ($scope,$state,$stateParams,$rightSlideDialog,apiStrategy) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.scenarioId = $stateParams.scenarioId;
        $scope.solutionId = $stateParams.solutionId;
        $scope.type = $stateParams.type||0;
        $scope.noslide = $stateParams.noslide;
        $scope.close = function(){
            $rightSlideDialog.close('new_rule_step_1');
        }
        $scope.save = function(){
            if($scope.validate()){
                if($scope.createTypeIndex == 0){                
                    $state.go("newRuleStep2",{solutionId:$scope.dataTmp.solutionEnt.id,scenarioId:$scope.dataTmp.scenarioEnt.id,scenarioCode:$scope.dataTmp.scenarioEnt.code,"noslide":'1'});
                } else if($scope.createTypeIndex == 1){
                    $state.go("newRuleStep3",{type:"new",solutionId:$scope.dataTmp.solutionEnt.id,scenarioId:$scope.dataTmp.scenarioEnt.id,noslide:"1"});    
                }   
            }        
        }
        $scope.checkCreateType = function(index){
            $scope.createTypeIndex = index;
        }
        $scope.dataTmp={};
        //初始获取参数
        $scope.init = function () {
            $scope.createTypeList = ['添加规则库规则', '自定义规则'];//, '使用规则模板新增规则'
            $scope.createTypeIndex = $scope.type;
            //场景列表
            apiStrategy.getScenariosSolutions({strategyId :$scope.strategyId},function(data){
                $scope.dataTmp.scenarioList = data;
                if($scope.dataTmp.scenarioList.length>0){
                    if($scope.scenarioId){
                        for(var i=$scope.dataTmp.scenarioList.length;i--;){
                            if($scope.dataTmp.scenarioList[i].id == $scope.scenarioId){
                                $scope.dataTmp.scenarioEnt = $scope.dataTmp.scenarioList[i];
                                $scope.changeScenario($scope.solutionId);
                                break;
                            }
                        }
                    }
                    // else{
                    //     $scope.dataTmp.scenarioEnt = $scope.dataTmp.scenarioList[0];
                    //     $scope.changeScenario();
                    // }
                }else{
                    $scope.dataTmp.scenarioEnt = "";
                    $scope.dataTmp.solutionList={};
                    $scope.dataTmp.solutionEnt="";
                }
            });

        };      
        $scope.changeScenario = function (solutionId) {
            $scope.dataTmp.solutionList={};
            for(var i=$scope.dataTmp.scenarioList.length;i--;){
                if($scope.dataTmp.scenarioEnt.id == $scope.dataTmp.scenarioList[i].id){
                    $scope.dataTmp.solutionList = $scope.dataTmp.scenarioList[i].solutions
                }
            }
            if($scope.dataTmp.solutionList.length>0){
                if(solutionId){
                    for(var i=$scope.dataTmp.solutionList.length;i--;){
                        if($scope.dataTmp.solutionList[i].id == solutionId){
                            $scope.dataTmp.solutionEnt = $scope.dataTmp.solutionList[i];
                            break;
                        }
                    }
                }
                // else{
                //     $scope.dataTmp.solutionEnt = $scope.dataTmp.solutionList[0];
                // }
            }else{
                $scope.dataTmp.solutionEnt = "";
            }
            $scope.validate_scenario();
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

    .controller('newRuleStep2Controller', function ($scope,$state,$stateParams,$rightSlideDialog,apiRule,RuleInstance,apiParameter) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.scenarioId = $stateParams.scenarioId;
        $scope.scenarioCode = $stateParams.scenarioCode;
        $scope.solutionId = $stateParams.solutionId;
        $scope.noslide = $stateParams.noslide;
        if(!$scope.solutionId){
            $state.go('ruleCenter');
            return;
        }
        $scope.selectTmp = {};
        $scope.selectTmp.selectTypesList = [{id:1,name:"规则名称"},{id:2,name:"字段"}];
        $scope.selectTmp.selectType = 1;
        $scope.selectTmp.queryKeyword = "";
        $scope.checkedCount = 0;

        $scope.changeCheckedCount = function() {            
            var _count=0;
            for(var i=0;i<$scope.libraryRuleList.length;i++){
                if($scope.libraryRuleList[i].checked){
                    _count++;
                }
            }
            $scope.checkedCount = _count;
            if(_count>0){
                $scope.tip_all = {invalid: false, info: ''};
            }
        };
        $scope.chooseRlue = function(rule) {    
            rule.checked=!rule.checked;
            $scope.changeCheckedCount();            
        }
        $scope.queryTypeChange = function() {
            $scope.selectTmp.queryKeyword="";            
        }
        
        $scope.close = function(){
            $rightSlideDialog.close('new_rule_step_2');
        }
        $scope.previous = function(){
            $state.go("newRuleStep1",{solutionId:$scope.solutionId,scenarioId:$scope.scenarioId,type:0,noslide:"1"});
        }
        $scope.save = function(){
            var ruleList = [];
            for(var i=0;i<$scope.libraryRuleList.length;i++){
                if($scope.libraryRuleList[i].checked){
                    ruleList.push({id:$scope.libraryRuleList[i].id});
                }
            }
            if(ruleList.length==0){
                $scope.tip_all = {invalid: true, info: '请至少选择一个规则'};
            } else {
                $scope.tip_all = {invalid: false, info: ''};
                var requestObj={
                    "strategyId": $scope.strategyId,
                    "scenarioId": $scope.scenarioId,
                    "solutionId": $scope.solutionId,
                    "scenarioCode":  $scope.scenarioCode,
                    "rules": ruleList
                }
                apiRule.postLibrary(requestObj,function(result){
                    RuleInstance.selectRules();
                    $scope.close();
                })
            }
            
        }
        $scope.checkCreateType = function(index){
            $scope.createTypeIndex = index;
        }
        $scope.clickTag = function(id){
            var _index = $scope.ruleTagChooseID.indexOf(id);
            if(_index==-1){
                $scope.ruleTagChooseID.push(id);
            }else{
                $scope.ruleTagChooseID.splice(_index,1);
            }
            $scope.selectLibraryRule();
        }
        $scope.dataTmp={};
        $scope.selectLibraryRule = function () {
            var _type=0;
            var _key = $scope.selectTmp.queryKeyword;
            if(_key!=""){
                _type = $scope.selectTmp.selectType;
            }
            if(_type==2){
                _key = $scope.selectTmp.queryKeyword.id;
            }
            var ruleList = [];
            if($scope.libraryRuleList){
                for(var i=0;i<$scope.libraryRuleList.length;i++){
                    if($scope.libraryRuleList[i].checked){
                        ruleList.push($scope.libraryRuleList[i].id);
                    }
                }
            }
            apiRule.getLibrary({type:_type,tags:$scope.ruleTagChooseID.join("_"),key:_key}, function(data){
                $scope.libraryRuleList = data;
                for(var i=$scope.libraryRuleList.length;i--;){
                    if(!$scope.libraryRuleList[i].id){
                        $scope.libraryRuleList.splice(i,1);
                    }
                    else if(ruleList.indexOf($scope.libraryRuleList[i].id)>-1){
                        $scope.libraryRuleList[i].checked = true;
                    }
                }
                $scope.changeCheckedCount();
            });
        }; 
        $scope.queryByEnterKey = function(e){
            if(e.charCode==13){
                $scope.selectLibraryRule();
            }
        }
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
        //初始获取参数
        $scope.init = function () {
            $scope.ruleTagChooseID = [];
            $scope.selectLibraryRule();
            apiRule.getLibraryTags({},function(data){
                $scope.dataTmp.ruleTagList = data;
                
            });
            $scope.ruleTagChooseID = [];
            $scope.getParameterList();
        };      
        $scope.init();

    })

    .controller('newRuleStep3Controller', function ($scope,$state,$stateParams,$timeout,$q,$rightSlideDialog,apiStrategy,apiSolution,apiRule,apiPredicator,apiParameter,RuleInstance) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.scenarioId = $stateParams.scenarioId;
        $scope.solutionId = $stateParams.solutionId;
        $scope.type  = $stateParams.type;
        $scope.noslide = $stateParams.noslide;

        $scope.typeList=["0","1","2"]; 

        if(!$scope.type){
            $state.go('ruleCenter');
            return;
        }
        $scope.editOldName = "";
        if($scope.type=="edit"){
            $scope.ruleId = $stateParams.ruleId;
        } 
        $scope.close = function(){
            $rightSlideDialog.close('new_rule_step_3');            
        }
        $scope.previous = function(){
            $state.go("newRuleStep1",{solutionId:$scope.solutionId,scenarioId:$scope.scenarioId,type:1,noslide:"1"});
        }
        $scope.save = function(){
            function fillDataValue(ent){
                if(ent.leftEnt.id){
                    ent.leftType = ent.leftEnt.mtype||ent.leftEnt.type;
                    if(ent.leftType==$scope.typeList[1]){
                        ent.leftParameterDTO={id:ent.leftEnt.id}
                        ent.leftValueType={id:ent.leftEnt.valueTypeId};
                    }else if(ent.leftType==$scope.typeList[2]){
                        ent.leftPredicatorDTO={id:ent.leftEnt.id}
                        ent.leftValueType={id:ent.leftEnt.valueTypeId};
                    }
                }else{
                    ent.leftType=$scope.typeList[0];
                    ent.leftValue=ent.leftEnt;
                }
                if(!ent.leftEnt){
                    return false;
                }
                if(ent.rightEnt.id){
                    ent.rightType = ent.rightEnt.mtype||ent.rightEnt.type;
                    if(ent.rightType==$scope.typeList[1]){
                        ent.rightParameterDTO={id:ent.rightEnt.id}
                        ent.rightValueType={id:ent.rightEnt.valueTypeId};
                    }else if(ent.rightType==$scope.typeList[2]){
                        ent.rightPredicatorDTO={id:ent.rightEnt.id}
                        ent.rightValueType={id:ent.rightEnt.valueTypeId};
                    }
                }else{
                    ent.rightType=$scope.typeList[0];
                    ent.rightValue=ent.rightEnt;
                }
                ent.operatorTypeDTO={id:ent.optionEnt.id};
                //删除无用对象，但如果提交失败会导致原有数据丢失，所以不要删了
                // delete ent.leftEnt;
                // delete ent.rightEnt;
                // delete ent.optionEnt;
            }

            if ($scope.validate()) {
                $scope.sessionData.strategyId = $scope.strategyId;
                $scope.sessionData.scenarioId = $scope.scenarioId;
                $scope.sessionData.solutionId = $scope.solutionId;
                for(var i=0;i<$scope.sessionData.groupDTO.conditionDTOs.length;i++){
                    fillDataValue($scope.sessionData.groupDTO.conditionDTOs[i]);
                }
                for(var i=0;i<$scope.sessionData.groupDTO.conditionGroupDTOs.length;i++){
                    for(var i1=0;i1<$scope.sessionData.groupDTO.conditionGroupDTOs[i].conditionDTOs.length;i1++){
                        var cDTO = $scope.sessionData.groupDTO.conditionGroupDTOs[i].conditionDTOs[i1];
                        fillDataValue(cDTO);
                    }
                }
                for(var i=$scope.sessionData.predicatorAndFactorDTOs.length;i--;){
                    if(!$scope.sessionData.predicatorAndFactorDTOs[i].id){
                        $scope.sessionData.predicatorAndFactorDTOs.splice(i,1);
                    }
                }
                if($scope.sessionData.predicatorAndFactorDTOs.length==0){
                    $scope.sessionData.predicatorAndFactorDTOs=[];
                }                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="new"){
                    apiRule.postCustom($scope.sessionData,function(result){
                        RuleInstance.selectRules();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    $scope.sessionData.ruleId = $scope.ruleId;
                    apiRule.putId($scope.sessionData,function(result){
                        RuleInstance.selectRules();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
            }
            
        }
        //下拉框按钮
        $scope.focusEnt = function(event,ent,which){
            //which-1:left,2:right
            if(which==1){
                $scope.tmpLeftEnt=ent.leftEnt;
                ent.leftEnt="";
            }else if(which==2){
                $scope.tmpRightEnt=ent.rightEnt;
                ent.rightEnt="";
            }            
            //$scope.changeGruopLeft(ent);
            $timeout(function(){
                $(event.target.parentElement.children[0].children[1]).trigger("focus");
            },10);
        }
        //添加、删除指标
        $scope.addPredicator = function(index){
            $scope.sessionData.predicatorAndFactorDTOs.splice(index+1,0,{
                "id": "",
                "factor": ""
            });
        }
        $scope.delPredicator = function(index){
            $scope.sessionData.predicatorAndFactorDTOs.splice(index,1);
        }
        //添加、删除条件组
        $scope.addConditionGroupSon = function(p_obj,index){
            p_obj.conditionDTOs.splice(index+1,0,angular.copy(emptyConditionDTO));
        }
        $scope.delConditionGroupSon = function(p_obj,index){
            p_obj.conditionDTOs.splice(index,1);
            if(p_obj.conditionDTOs.length==0){
                //$scope.sessionData.groupDTO.conditionDTOs.splice(0,0,p_obj.conditionDTOs[0]);
                $scope.sessionData.groupDTO.conditionGroupDTOs.splice($scope.sessionData.groupDTO.conditionGroupDTOs.indexOf(p_obj),1);
            }
        }
        //删除条件
        $scope.delConditionSon = function(index){
            $scope.sessionData.groupDTO.conditionDTOs.splice(index,1);
        }
        

        //添加条件
        $scope.addCondition = function(){
            $scope.sessionData.groupDTO.conditionDTOs.push(angular.copy(emptyConditionDTO));
        }
        //添加条件组
        $scope.addConditionGroup = function(){
            $scope.sessionData.groupDTO.conditionGroupDTOs.push(angular.copy(emptyconditionGroupDTOs));
        }
        //改变group联动
        $scope.changeGruopLeft = function(ent,optionId){
            if($scope.tmpLeftEnt){
                ent.leftEnt = $scope.tmpLeftEnt;
                $scope.tmpLeftEnt="";
            }
            var _tmpOperator =  ent.optionEnt;
            if($scope.parameterAllList.length==0||!ent.leftEnt.valueTypeId){
                ent.leftEnt="";
                ent.operatorList=[];
                ent.rightList=[];  
                return
            }
            if(ent.leftEnt){ 
                if(ent.leftEnt.valueTypeId){
                    var objJson={valueTypeId:ent.leftEnt.valueTypeId}
                    if(ent.leftEnt.mtype==$scope.typeList[1]){
                        objJson.parameterId=ent.leftEnt.id;
                    }else if(ent.leftEnt.mtype==$scope.typeList[2]){
                        objJson.predicatorId=ent.leftEnt.id;
                    }
                    apiRule.getOperatorTypes(objJson,function(data){
                        ent.operatorList=data;
                        if(data.length==1&&data[0].operatorTypes){
                            ent.operatorList=data[0].operatorTypes;
                        }
                        ent.dictionary=null;
                        if(data.length==1&&data[0].dictionary){
                            ent.dictionary=data[0].dictionary;
                        }

                        if(_tmpOperator){
                            for(var i=0;i<ent.operatorList.length;i++){
                                if(ent.operatorList[i].id==_tmpOperator.id){
                                    ent.optionEnt=ent.operatorList[i];
                                    break;
                                }
                            }
                            $scope.changeGruopOperator(ent,optionId);
                        }else if(optionId){
                            for(var i=0;i<ent.operatorList.length;i++){
                                if(ent.operatorList[i].id==optionId){
                                    ent.optionEnt=ent.operatorList[i];
                                    break;
                                }
                            }
                            $scope.changeGruopOperator(ent,optionId);
                        }
                    });
                }
                // else{
                //     //输入值时候
                //     var data=[]
                //     ent.operatorList=data;
                //     if(_tmpOperator){
                //         for(var i=0;i<ent.operatorList.length;i++){
                //             if(ent.operatorList[i].id==_tmpOperator.id){
                //                 ent.optionEnt=ent.operatorList[i];
                //                 break;
                //             }
                //         }
                //     }
                // }
            }
            if(!optionId){
                $scope.resetChoosePredicator();
            }
        }
        $scope.changeGruopOperator = function(ent,optionId){
            var _tmpRightEnt =  ent.rightEnt  ; 
            if(ent.optionEnt){
                apiRule.getValues({operatorTypeId:ent.optionEnt.id,type:0,strategyId:$scope.strategyId},function(data){
                    ent.rightList=data;                
                    if(_tmpRightEnt){
                        if(_tmpRightEnt.id){
                            var catchFlag = false;
                            for(var i=0;i<ent.rightList.length;i++){
                                if(_tmpRightEnt.type==ent.rightList[i].type && ent.rightList[i].id==_tmpRightEnt.id){
                                    ent.rightEnt=ent.rightList[i];
                                    catchFlag=true;
                                    break;
                                }
                            }
                            if(!catchFlag){
                                ent.rightEnt={
                                    id:_tmpRightEnt.id,
                                    name:_tmpRightEnt.name,
                                    code:_tmpRightEnt.code,
                                    type:_tmpRightEnt.type
                                }
                            }
                        }else{
                            ent.rightEnt=_tmpRightEnt;
                        }
                    }else{
                        ent.rightEnt="";
                    }
                });
            }else{
                ent.rightEnt="";
            }
            if(!optionId){
                $scope.resetChoosePredicator();
            }
        }
        $scope.changeGruopRight = function(ent){
            if($scope.tmpRightEnt){
                ent.rightEnt = $scope.tmpRightEnt;
                $scope.tmpRightEnt="";
            }
            if(ent.rightEnt&&!ent.rightEnt.id){
                for(var i=0;i<ent.rightList.length;i++){
                    if(ent.rightEnt==ent.rightList[i].name){
                        ent.rightEnt = ent.rightList[i];
                        break;
                    }
                }
            }
            $scope.resetChoosePredicator();
        }
        //改变状态
        $scope.changeStatus = function(ent){
            if(ent.status=='0'){
                ent.status="1";
            }else{
                ent.status="0";
            }
        }
               
        var emptyConditionDTO = {}
        var emptyconditionGroupDTOs = {
            "andOr": "and",
            "conditionDTOs":[
                angular.copy(emptyConditionDTO),
                angular.copy(emptyConditionDTO)
            ]

        }
        $scope.sessionData = {
            "name": "",
            "status": "1",
            "baseScore": 60,
            "predicatorAndFactorDTOs": [{
                "id": "",
                "factor": "0"
            }],
            "groupDTO": {
                "andOr": "or",
                "conditionDTOs": [
                  //angular.copy(emptyConditionDTO)
                ],
                "conditionGroupDTOs": [
                    //angular.copy(emptyconditionGroupDTOs)
                ]
            }
        }

        $scope.needCheck = true;
        $scope.andorList = [{id:"or",name:"或"},{id:"and",name:"与"}]
        $scope.operatorList = [];
        $scope.dataTmp = {};
        //分值分值指标列表
        $scope.choosePredicatorList = [];
        $scope.resetChoosePredicator = function(){
            $scope.choosePredicatorList = [{id:-1,name:"选择指标"}];
            $scope.choosePredicatorIDList = [];
            function intoChoosePredicator(ent){
                if(ent.leftEnt&&ent.leftEnt.id&&ent.leftEnt.mtype==$scope.typeList[2]){
                    if($scope.choosePredicatorIDList.indexOf(ent.leftEnt.id)==-1){
                        $scope.choosePredicatorIDList.push(ent.leftEnt.id);
                        $scope.choosePredicatorList.push(ent.leftEnt);
                    }
                }
                if(ent.rightEnt&&ent.rightEnt.id&&(ent.rightEnt.mtype==$scope.typeList[2]||ent.rightEnt.type==$scope.typeList[2])){
                    if($scope.choosePredicatorIDList.indexOf(ent.rightEnt.id)==-1){
                        $scope.choosePredicatorIDList.push(ent.rightEnt.id);
                        $scope.choosePredicatorList.push(ent.rightEnt);
                    }
                }
            }
            for(var i=0;i<$scope.sessionData.groupDTO.conditionDTOs.length;i++){
                intoChoosePredicator($scope.sessionData.groupDTO.conditionDTOs[i]);
            }
            for(var i=0;i<$scope.sessionData.groupDTO.conditionGroupDTOs.length;i++){
                for(var i1=0;i1<$scope.sessionData.groupDTO.conditionGroupDTOs[i].conditionDTOs.length;i1++){
                    var cDTO = $scope.sessionData.groupDTO.conditionGroupDTOs[i].conditionDTOs[i1];
                    intoChoosePredicator(cDTO);
                }
            }
            for(var i=$scope.sessionData.predicatorAndFactorDTOs.length;i--;){
                if($scope.choosePredicatorIDList.indexOf($scope.sessionData.predicatorAndFactorDTOs[i].id)==-1){
                    $scope.sessionData.predicatorAndFactorDTOs[i].id="";
                }
            }
        }
        //初始获取参数
        $scope.init = function () {
            $q.all([apiPredicator.getNew({keywordType:'0',strategyId:$scope.strategyId}).$promise,
                    apiParameter.getWithStatus({}).$promise])
            .then(function(data){
                //指标列表
                $scope.predicatorList=data[0];
                for(var i = $scope.predicatorList.length;i--;){
                    $scope.predicatorList[i].mtype=$scope.typeList[2];
                }
                //字段列表
                $scope.parameterList = data[1];
                for(var i = $scope.parameterList.length;i--;){
                    $scope.parameterList[i].mtype=$scope.typeList[1];
                }
                $scope.parameterAllList = $scope.predicatorList.concat($scope.parameterList);
                if($scope.type=="edit"){
                    $scope.getInfo();
                }
            });
        };

        //修改规则时获取数据
        $scope.getInfo = function () {

            function intoDataValue(ent){
                if(ent.leftType==$scope.typeList[0]){
                    ent.leftEnt = ent.leftValue;
                }else if(ent.leftType==$scope.typeList[1]){
                    for(var i=$scope.parameterAllList.length;i--;){
                        if($scope.parameterAllList[i].mtype==$scope.typeList[1] && ent.leftParameterDTO.id==$scope.parameterAllList[i].id){
                            ent.leftEnt = $scope.parameterAllList[i];
                            break;
                        }
                    }
                    if(!ent.leftEnt){
                        ent.leftParameterDTO.mtype=$scope.typeList[1];
                        $scope.parameterAllList.push(angular.copy(ent.leftParameterDTO));
                        ent.leftEnt=$scope.parameterAllList[$scope.parameterAllList.length-1];
                    }
                }else  if(ent.leftType==$scope.typeList[2]){
                    for(var i=$scope.parameterAllList.length;i--;){
                        if($scope.parameterAllList[i].mtype==$scope.typeList[2] && ent.leftPredicatorDTO.id==$scope.parameterAllList[i].id){
                            ent.leftEnt = $scope.parameterAllList[i];
                            break;
                        }
                    }
                    if(!ent.leftEnt){
                        ent.leftParameterDTO.mtype=$scope.typeList[2];
                        $scope.parameterAllList.push(angular.copy(ent.leftPredicatorDTO));
                        ent.leftEnt=$scope.parameterAllList[$scope.parameterAllList.length-1];
                    }
                }
                if(ent.rightType==$scope.typeList[0]){
                    ent.rightEnt = ent.rightValue;
                }else if(ent.rightType==$scope.typeList[1]){
                    ent.rightEnt = ent.rightParameterDTO;
                    ent.rightEnt.type = $scope.typeList[1];
                }else  if(ent.rightType==$scope.typeList[2]){
                    ent.rightEnt = ent.rightPredicatorDTO;
                    ent.rightEnt.type = $scope.typeList[2];
                }
                $scope.changeGruopLeft(ent,ent.operatorTypeDTO.id);
                

            }
            apiRule.getId({ruleId:$scope.ruleId},function (data) {
                $scope.sessionData = data;
                if(!$scope.sessionData.predicatorAndFactorDTOs||$scope.sessionData.predicatorAndFactorDTOs.length==0){
                    $scope.sessionData.predicatorAndFactorDTOs = [{
                        "id": "",
                        "factor": "0"
                    }];
                }
                for(var i=0;i<$scope.sessionData.groupDTO.conditionDTOs.length;i++){
                    intoDataValue($scope.sessionData.groupDTO.conditionDTOs[i]);
                }
                for(var i=0;i<$scope.sessionData.groupDTO.conditionGroupDTOs.length;i++){
                    for(var i1=0;i1<$scope.sessionData.groupDTO.conditionGroupDTOs[i].conditionDTOs.length;i1++){
                        var cDTO = $scope.sessionData.groupDTO.conditionGroupDTOs[i].conditionDTOs[i1];
                        intoDataValue(cDTO);
                    }
                }
                $scope.resetChoosePredicator();
                
            });
            
        };
        $scope.init();

        //规则分值修改
        $scope.cutBaseScore = function() {
            $scope.sessionData.baseScore=$scope.sessionData.baseScore.replace(/^(.*\..{2}).*$/,"$1");
        }
        $scope.cutPredicatorScore = function(ent){
            ent.factor=ent.factor.replace(/^(.*\..{4}).*$/,"$1");
        }
        $scope.changBaseScore = function(ent){
            if(ent.factor===""||isNaN($scope.sessionData.baseScore)){
                $scope.sessionData.baseScore="";
            }else{
                $scope.sessionData.baseScore=(parseFloat($scope.sessionData.baseScore)+"").replace(/^(.*\..{2}).*$/,"$1");
            }
            $scope.validate_predicator();
        }
        $scope.changPredicatorScore = function(ent){
            if(ent.factor===""||isNaN(ent.factor)){
                ent.factor="";
            }else{
                ent.factor=(parseFloat(ent.factor)+"").replace(/^(.*\..{4}).*$/,"$1");
            }
            $scope.validate_predicator();           
        }
        $scope.changPredicatorEnt = function(ent){
            if(ent&&ent.id==-1){
                ent.id="";
            }
            $scope.validate_predicator();            
        }
        
        //验证规则名称
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            var getBLen = function(str) {
                if (str == null) return 0;
                if (typeof str != "string"){str += "";}
                return str.replace(/[^x00-xff]/g,"01").length;
            }
            if ($scope.sessionData.name === '') {
                $scope.tip_name = {invalid: true, info: '规则名称不能为空'};
            } /*else if (!namePattern.test($scope.sessionData.name)) {
                $scope.tip_name = {invalid: true, info: '规则名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            } */ else if (getBLen($scope.sessionData.name)>80||getBLen($scope.sessionData.name)<2) {
                $scope.tip_name = {invalid: true, info: '规则名称字符长度为2-80'};
            } else {
                $scope.tip_name = {invalid: false, info: ''};
            }
            return !$scope.tip_name.invalid;
        };
        //验证规则分值
        $scope.validate_predicator = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.sessionData.baseScore) {
                $scope.tip_predicator = {invalid: true, info: '请正确填写规则分值'};
            }else if (!angular.isNumber(+$scope.sessionData.baseScore)||isNaN($scope.sessionData.baseScore)) {
                $scope.tip_predicator = {invalid: true, info: '请正确填写规则分值'};
            }else {
                $scope.tip_predicator = {invalid: false, info: ''};
                for(var i=0;i<$scope.sessionData.predicatorAndFactorDTOs.length;i++){
                    var cpEnt = $scope.sessionData.predicatorAndFactorDTOs[i];
                    if(cpEnt.factor!=""&&!angular.isNumber(+cpEnt.factor)||isNaN(cpEnt.factor)){
                         $scope.tip_predicator = {invalid: true, info: '请正确填写规则分值'};
                         break;
                    }
                }
            }
            return !$scope.tip_predicator.invalid;
        };
        //验证模板
        $scope.validate_template = function () {
            $scope.tip_all = {invalid: false, info: ''};

            if (!$scope.dataTmp.templateEnt) {
                $scope.tip_template = {invalid: true, info: '请选择规则模板'};
            } else {
                $scope.tip_template = {invalid: false, info: ''};
            }
            return !$scope.tip_template.invalid;
        };
        //验证条件条件组
        $scope.validate_condition = function () {
            $scope.tip_all = {invalid: false, info: ''};
            function isPInt(str) {
                var g = /^[1-9]*[1-9][0-9]*$/;
                return g.test(str);
            }
            function checkDataValue(ent){
                if(!ent.leftEnt){
                    return false;
                }
                if(!ent.rightEnt){
                   return false;
                }
                if(!ent.optionEnt){
                   return false;
                }
                return true;
            }
            var retFlag=true;
            for(var i=0;i<$scope.sessionData.groupDTO.conditionDTOs.length;i++){
                retFlag = checkDataValue($scope.sessionData.groupDTO.conditionDTOs[i])&&retFlag;
            }
            for(var i=0;i<$scope.sessionData.groupDTO.conditionGroupDTOs.length;i++){
                for(var i1=0;i1<$scope.sessionData.groupDTO.conditionGroupDTOs[i].conditionDTOs.length;i1++){
                    var cDTO = $scope.sessionData.groupDTO.conditionGroupDTOs[i].conditionDTOs[i1];
                    retFlag = checkDataValue(cDTO)&&retFlag;
                }
            }

            if(retFlag){
                $scope.tip_condition = {invalid: false, info: ''};
            }else{
                $scope.tip_condition = {invalid: true, info: '请正确输入条件及条件组'};
            }
            return !$scope.tip_condition.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight =  $scope.validate_name() & $scope.validate_predicator() & $scope.validate_condition();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };
        
    });