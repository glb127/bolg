'use strict';

angular.module('cloudxWebApp')
    .controller('newPredicatorController', function ($scope,$state,$stateParams,$rightSlideDialog,apiPredicator) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.noslide = $stateParams.noslide;
        $scope.close = function(){
            $rightSlideDialog.close('new_predicator');
        }
        $scope.save = function(){           
            $state.go("editPredicator",{type:"new"}); 
        }
        $scope.clickTemplate = function(index){
            if($scope.templateIndex==index){
                $scope.templateIndex=-1;
            }else{
                $scope.templateIndex=index;
            }
        }
        $scope.clickOneTemplate = function(ent){
            if(ent.type==2){
                console.log(ent.type+"_"+ent.calculationFactorType);
            }else{
                console.log(ent.type)
            }
            //type：0--计算类指标 1--数据服务指标 2--运算类指
            if(ent.type==0){
                $state.go("editPredicator",{type:"new",predicatorId:ent.id,noslide:'1'});
            }else if(ent.type==1){
                $state.go("editPredicator1",{type:"new",predicatorId:ent.id,noslide:'1'});
            }else if(ent.type==2){
                if(ent.calculationFactorType==0){
                    $state.go("editPredicator2",{type:"new",noslide:'1'});
                }else if(ent.calculationFactorType==1){
                    $state.go("editPredicator2_1",{type:"new",noslide:'1'});
                }else if(ent.calculationFactorType==2){
                    $state.go("editPredicator2_2",{type:"new",noslide:'1'});
                }
            }else if(ent.type==3){
                $state.go("editPredicator3",{type:"new",predicatorId:ent.id,noslide:'1'});
            }

        }

        //初始获取参数
        $scope.init = function () {
            $scope.templateIndex = 0;
            //场景列表
            apiPredicator.getTemplate({},function(data){
                $scope.templateList = data;
                
            });
        };      
        $scope.init();

    })
    //计算类指标
    .controller('editPredicatorController', function ($scope,$state,$stateParams,$timeout,$uibModal,$rightSlideDialog,apiStrategy,apiSolution,apiRule,apiPredicator,apiParameter,RuleInstance) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.type  = $stateParams.type;       
        $scope.predicatorId = $stateParams.predicatorId;
        $scope.noslide = $stateParams.noslide;
        $scope.typeList=["0","1","2"]; 
        if(!$scope.type){
            $state.go('ruleCenter');
            return;
        }
        $scope.close = function(){
            $rightSlideDialog.close('edit_predicator');
        }
        $scope.back = function(){
            $state.go("newPredicator",{noslide:'1'});
        }
        $scope.save = function(){
            if($scope.type=="edit"){
                apiPredicator.putUsedStatus({strategyId:$scope.strategyId, predicatorId:$scope.predicatorId},function(data){
                    if(data.result=="1"){
                         $scope.saveStep2();
                    }else{
                        data.type="修改";
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
            }else{
                $scope.saveStep2();
            }
        }

        $scope.saveStep2 = function(){
            function fillDataValue(ent){
                if(ent.leftEnt.id){
                    ent.leftType = $scope.typeList[1];
                    ent.leftParameterId=ent.leftEnt.id;
                    ent.leftParameterName=ent.leftEnt.name;
                    ent.leftValueTypeId=ent.leftEnt.valueTypeId;
                }else{
                    ent.leftType=$scope.typeList[0];
                    ent.leftValue=ent.leftEnt;
                }
                if(!ent.rightEnt.id){
                    for(var i=0;i<ent.rightList.length;i++){
                        if(ent.rightEnt==ent.rightList[i].name){
                            ent.rightEnt = ent.rightList[i];
                            break;
                        }
                    }
                }
                if(ent.rightEnt.id){
                    ent.rightType = $scope.typeList[1];
                    ent.rightParameterId=ent.rightEnt.id;
                    ent.rightParameterName=ent.rightEnt.name;
                    ent.rightVauleTypeId=ent.rightEnt.valueTypeId;
                }else{
                    ent.rightType=$scope.typeList[0];
                    ent.rightValue=ent.rightEnt;
                }
                ent.operatorId=ent.optionEnt.id;
                ent.operatorName=ent.optionEnt.name;
                //删除无用对象，但如果提交失败会导致原有数据丢失，所以不要删了
                // delete ent.leftEnt;
                // delete ent.rightEnt;
                // delete ent.optionEnt;
            }
            if ($scope.validate()) {
                $scope.pmDTO.name= $scope.cpDTO.name;
                //0当前，1指定，2全部
                if($scope.cpDTO.scenarioTypeCode=="-1"){
                    $scope.cpDTO.scenarioMode="2";
                }else if($scope.cpDTO.scenarioTypeCode=="-2"){
                    $scope.cpDTO.scenarioMode="0";
                }else{
                    $scope.cpDTO.scenarioMode="1";
                }
                if($scope.cpDTO.solutionId=="-1"){
                    $scope.cpDTO.solutionMode="2";
                }else if($scope.cpDTO.solutionId=="-2"){
                    $scope.cpDTO.solutionMode="0";
                }else{
                    $scope.cpDTO.solutionMode="1";
                }
                for(var i=0;i<$scope.cpDTO.predicatorParameterDTOs.length;i++){
                    for(var i1=0;i1<$scope.cpDTO.predicatorParameterDTOs[i].parameterElementDTOs.length;i1++){
                        var peDTO = $scope.cpDTO.predicatorParameterDTOs[i].parameterElementDTOs[i1];
                        peDTO.parameterName = peDTO.dictionary[peDTO.parameterId];                        
                        if($scope.elementType0(peDTO)&&peDTO.dictionaryList&&peDTO.dictionaryList.length>0){
                            for(var dent in peDTO.dictionary){
                               if(peDTO.valueTmp==peDTO.dictionary[dent]){
                                    peDTO.value=dent;
                                    break;
                               }
                            }
                        }
                        if(peDTO.elementType=="2"){
                            peDTO.value= (peDTO.checked ==true?"1":"0");
                        } else if(peDTO.elementType=="1"){
                            if(peDTO.valueTypeCategory=="Date"){
                                if(!peDTO.value){
                                    peDTO.value="0:00";
                                }else{
                                    if(peDTO.value.getHours){
                                        peDTO.value = peDTO.value.getHours()+":"+peDTO.value.getMinutes();
                                    }
                                }
                            }
                        }
                        if(peDTO.type==1){
                            peDTO.parameterId = peDTO.value;
                            peDTO.parameterName = peDTO.dictionary[peDTO.parameterId];
                        }
                    }
                }
                $scope.pmDTO.strategyId = $scope.strategyId;
                if($scope.cpDTO.extraFilter&&$scope.cpDTO.extraFilter.filterDTOs){
                    for(var i=$scope.cpDTO.extraFilter.filterDTOs.length;i--;){
                        if($scope.cpDTO.extraFilter.filterDTOs[i].leftEnt){
                            fillDataValue($scope.cpDTO.extraFilter.filterDTOs[i]);
                        }else{
                            $scope.cpDTO.extraFilter.filterDTOs.splice(i,1)
                        }
                    }
                }
                if($scope.cpDTO.specialFilter){
                    for(var i=$scope.cpDTO.specialFilter.filterDTOs.length;i--;){
                        if($scope.cpDTO.specialFilter.filterDTOs[i].leftEnt){
                            fillDataValue($scope.cpDTO.specialFilter.filterDTOs[i]);
                        }else{
                            $scope.cpDTO.specialFilter.filterDTOs.splice(i,1)
                        }
                    }
                }                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="new"){
                    apiPredicator.post($scope.pmDTO,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    $scope.pmDTO.predicatorId = $scope.predicatorId;
                    apiPredicator.putId($scope.pmDTO,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    }),function(){
                        $scope.saveFlag=false;
                    };
                }
            }
            
        }
        $scope.andorList = [{id:"or",name:"或"},{id:"and",name:"与"}];
        $scope.boolList = [{id:"true",name:"是"},{id:"false",name:"否"}];
        var emptyConditionDTO = {}
        var emptyExtraFilter = {
            "andOr": "and",
            "filterDTOs":[
                angular.copy(emptyConditionDTO),
                angular.copy(emptyConditionDTO)
            ]
        }
        var emptyExtraFilter1 = {
            "andOr": "and",
            "filterDTOs":[
                angular.copy(emptyConditionDTO)
            ]
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
            } else if(which==3){
                $scope.tmpValueEnt=ent.valueTmp;
                ent.valueTmp="";
            }
            $timeout(function(){
                $(event.target.parentElement.children[0].children[1]).trigger("focus");
            },10);
        }
        //场景改变事件
        $scope.changeScenario = function(){
            //$scope.validate_scenario();
            var _solutionList=[];
            for(var i=0;i<$scope.cpDTO.scenarioList.length;i++){
                if($scope.cpDTO.scenarioList[i].code==$scope.cpDTO.scenarioTypeCode){
                    _solutionList=$scope.cpDTO.scenarioList[i].solutions;
                }
            }
            $scope.solutionAllList=_solutionList||[];//[{id:"-1",name:'全部锦囊'},{id:"-2",name:'当前锦囊'}].concat(
            if($scope.cpDTO.solutionId){
                for(var i=0;i<$scope.solutionAllList.length;i++){
                    if($scope.cpDTO.solutionId==$scope.solutionAllList[i].id){
                        $scope.cpDTO.solutionId=$scope.solutionAllList[i].id;
                        break;
                    }
                }
            }
        }
        //是否显示锦囊
        $scope.isSolutionShow = function(){
            if(!$scope.cpDTO){
                return false;
            }
            return $scope.cpDTO.solutionIsShow=='0' && $scope.cpDTO.solutionIsShow=='0' && $scope.cpDTO.scenarioTypeCode && $scope.cpDTO.scenarioTypeCode!="-1" && $scope.cpDTO.scenarioTypeCode!="-2";

        }
        // 通过不同ValueTypeCategory来显示哪种
        $scope.showValueTypeCategory = function(valType,widType){
            //valType:String,Number,List,Time,Boolean,GPS
            //widType:String,Number,Time,Boolean
            if(valType=="String"&&widType=="String"){
                return true;
            } else if(valType=="Number"&&widType=="Number"){
                return true;
            } else if(valType=="List"&&widType=="String"){
                return true;
            } else if(valType=="Date"&&widType=="Date"){
                return true;
            } else if(valType=="Boolean"&&widType=="Boolean"){
                return true;
            } else if(valType=="GPS"&&widType=="String"){
                return true;
            }
            return false;
        }
        $scope.peDTOnumberChange = function(peDTO){
            if(!peDTO.value||peDTO.value-0<0){
                peDTO.value=0;
            }
        }
        //添加过滤条件
        $scope.addExtraFilter = function(){
            if($scope.cpDTO.extraFilter&&$scope.cpDTO.extraFilter.filterDTOs&&$scope.cpDTO.extraFilter.filterDTOs.length){
                $scope.addConditionGroupSon($scope.cpDTO.extraFilter.filterDTOs.length-1);
            }else{
                $scope.cpDTO.extraFilter=angular.copy(emptyExtraFilter);
            }            
        }
        //添加、删除过滤条件子类
        $scope.addConditionGroupSon = function(index){
            $scope.cpDTO.extraFilter.filterDTOs.splice(index+1,0,angular.copy(emptyConditionDTO));
        }
        $scope.delConditionGroupSon = function(index){
            $scope.cpDTO.extraFilter.filterDTOs.splice(index,1);
            if($scope.cpDTO.extraFilter.filterDTOs.length==0){
                delete $scope.cpDTO.extraFilter;
            }
        }

        //添加次数统计过滤条件
        $scope.addSpecialFilter = function(){
            if($scope.cpDTO.specialFilter&&$scope.cpDTO.specialFilter.filterDTOs&&$scope.cpDTO.specialFilter.filterDTOs.length){
                $scope.addSpecialConditionGroupSon($scope.cpDTO.specialFilter.filterDTOs.length-1);
            }else{
                $scope.cpDTO.specialFilter=angular.copy(emptyExtraFilter1);
            }            
        }
        //添加、删除过滤条件子类
        $scope.addSpecialConditionGroupSon = function(index){
            $scope.cpDTO.specialFilter.filterDTOs.splice(index+1,0,angular.copy(emptyConditionDTO));
        }
        $scope.delSpecialConditionGroupSon = function(index){
            $scope.cpDTO.specialFilter.filterDTOs.splice(index,1);
            if($scope.cpDTO.specialFilter.filterDTOs.length==0){
                delete $scope.cpDTO.specialFilter;
            }
        }

        $scope.elementType0 = function(ent){
            return ent.elementType=='0'||(ent.elementType=='3'&&ent.type=="1");
        }
        $scope.elementType1 = function(ent){
            return ent.elementType=='1'||(ent.elementType=='3'&&ent.type=="0");
        }
        $scope.changeElementType3 = function(ent){
            if(ent.type=='1'){
                ent.type='0';
            }else{
                ent.type='1'
            };
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
                    if(ent.leftEnt.mtype==$scope.typeList[1]||ent.leftEnt.type==$scope.typeList[1]){
                        objJson.parameterId=ent.leftEnt.id;
                    }else if(ent.leftEnt.mtype==$scope.typeList[2]||ent.leftEnt.type==$scope.typeList[2]){
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
                            $scope.changeGruopOperator(ent);
                        }else if(optionId){
                            for(var i=0;i<ent.operatorList.length;i++){
                                if(ent.operatorList[i].id==optionId){
                                    ent.optionEnt=ent.operatorList[i];
                                    break;
                                }
                            }
                            $scope.changeGruopOperator(ent)
                        }
                    });
                }
            }
        }
        $scope.changeGruopOperator = function(ent){
            var _tmpRightEnt =  ent.rightEnt  ; 
            if(ent.optionEnt){
                apiRule.getValues({operatorTypeId:ent.optionEnt.id,type:1,strategyId:$scope.strategyId},function(data){
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
            }
        }
        $scope.changeGruopRight = function(ent){
            if($scope.tmpRightEnt){
                ent.rightEnt = $scope.tmpRightEnt;
                $scope.tmpRightEnt="";
            }
        }
        $scope.changeType0Value = function(ent){
            if($scope.tmpValueEnt){
                ent.value = $scope.tmpValueEnt;
                ent.valueTmp = ent.value;
                $scope.tmpValueEnt="";
            }else if(ent.dictionaryList.indexOf(ent.valueTmp)==-1){
                ent.valueTmp = "";
                ent.value = ent.valueTmp;
            }
        }
        $scope.isEmptyShow = function (ent) {
            return ent.isEmpty=='1'?'必填项':' ';
        }
        //初始获取参数
        $scope.init = function () {

            function intoDataValue(ent){
                if(ent.leftType==$scope.typeList[0]){
                    ent.leftEnt = ent.leftValue;
                }else if(ent.leftType==$scope.typeList[1]){
                    for(var i=$scope.parameterAllList.length;i--;){
                        if($scope.parameterAllList[i].mtype==$scope.typeList[1] && ent.leftParameterId==$scope.parameterAllList[i].id){
                            ent.leftEnt = $scope.parameterAllList[i];
                            break;
                        }
                    }
                    if(!ent.leftEnt){
                        $scope.parameterAllList.push({
                            id:ent.leftParameterId,
                            name:ent.leftParameterName,
                            mtype:$scope.typeList[1]
                        });
                        ent.leftEnt=$scope.parameterAllList[$scope.parameterAllList.length-1];
                    }
                }else  if(ent.leftType==$scope.typeList[2]){
                    for(var i=$scope.parameterAllList.length;i--;){
                        if($scope.parameterAllList[i].mtype==$scope.typeList[2] && ent.leftPredicatorId==$scope.parameterAllList[i].id){
                            ent.leftEnt = $scope.parameterAllList[i];
                            break;
                        }
                    }
                    if(!ent.leftEnt){
                        $scope.parameterAllList.push({
                            id:ent.leftPredicatorId,
                            name:ent.leftPredicatorName,
                            mtype:$scope.typeList[2]
                        });
                        ent.leftEnt=$scope.parameterAllList[$scope.parameterAllList.length-1];
                    }
                }
                if(!ent.leftEnt){
                    return false;
                }
                if(ent.rightType==$scope.typeList[0]){
                    ent.rightEnt = ent.rightValue;
                }else if(ent.rightType==$scope.typeList[1]){
                    ent.rightEnt = {
                        id:ent.rightParameterId,
                        name:ent.rightParameterName,
                        mtype:$scope.typeList[1],
                        type:$scope.typeList[1]
                    };
                }else  if(ent.rightType==$scope.typeList[2]){
                    ent.rightEnt = {
                        id:ent.rightPredicatorId,
                        name:ent.rightPredicatorName,
                        mtype:$scope.typeList[2],
                        type:$scope.typeList[2]
                    };
                }
                $scope.changeGruopLeft(ent,ent.operatorId);
            }
            //字段列表
            apiParameter.get({},function(data){
                $scope.parameterAllList = data;
                for(var i = $scope.parameterAllList.length;i--;){
                    $scope.parameterAllList[i].mtype=$scope.typeList[1];
                }
                var getInfo =  function(data){
                    $scope.pmDTO = data;
                    if(!$scope.pmDTO.status){
                        $scope.pmDTO.status = "1";
                    }
                    var timeCount=0;
                    $scope.cpDTO = $scope.pmDTO.calculationPredicatorDTO;
                    $scope.editOldName=$scope.cpDTO.name;
                    if($scope.cpDTO && $scope.cpDTO.predicatorParameterDTOs){
                        for(var i=0;i<$scope.cpDTO.predicatorParameterDTOs.length;i++){
                            for(var i1=0;i1<$scope.cpDTO.predicatorParameterDTOs[i].parameterElementDTOs.length;i1++){
                                var peDTO = $scope.cpDTO.predicatorParameterDTOs[i].parameterElementDTOs[i1];
                                if(peDTO.value==""&&peDTO.defaultValue!=""){
                                    peDTO.value = peDTO.defaultValue;
                                }
                                if($scope.elementType0(peDTO)&&peDTO.dictionary){
                                    peDTO.dictionaryList=[];
                                    for(var ent in peDTO.dictionary){
                                        peDTO.dictionaryList.push(peDTO.dictionary[ent]);
                                    }
                                    if(peDTO.value){
                                        peDTO.valueTmp=peDTO.dictionary[peDTO.value]||peDTO.value;
                                    }
                                }
                                if(peDTO.elementType=="1"){
                                    if(peDTO.valueTypeCategory=="Number"){
                                        peDTO.value=peDTO.value-0;
                                    }else if(peDTO.valueTypeCategory=="Date"){
                                        timeCount++;
                                        if(!peDTO.value||peDTO.value.split(":").length<2){
                                            if(timeCount%2==1){
                                                peDTO.value="0:00";
                                            }else{
                                                peDTO.value="23:59";
                                            }
                                        }
                                        var _date = new Date();
                                        _date.setHours(peDTO.value.split(":")[0]);
                                        _date.setMinutes(peDTO.value.split(":")[1]);
                                        peDTO.value=_date;
                                    }
                                } else if(peDTO.elementType=="2"){
                                    //****需要再考虑，如果elementType为2type为1时****
                                    if(!peDTO.value){
                                        peDTO.value="0"
                                    }
                                    peDTO.checked = (peDTO.value=="1"?true:false);
                                }

                            }
                        }
                    }                    
                    if($scope.cpDTO.extraFilter&&$scope.cpDTO.extraFilter.filterDTOs){
                        for(var i=0;i<$scope.cpDTO.extraFilter.filterDTOs.length;i++){
                            intoDataValue($scope.cpDTO.extraFilter.filterDTOs[i]);
                        }
                    }
                    //次数过滤
                    if($scope.cpDTO.specialFilterIsShow=="0"){
                        if(!$scope.cpDTO.specialFilter||!$scope.cpDTO.specialFilter.filterDTOs||$scope.cpDTO.specialFilter.filterDTOs.length==0){
                            $scope.cpDTO.specialFilter = angular.copy(emptyExtraFilter1);
                        }
                        for(var i=0;i<$scope.cpDTO.specialFilter.filterDTOs.length;i++){
                            intoDataValue($scope.cpDTO.specialFilter.filterDTOs[i]);
                        }
                    }
                    
                    $scope.scenarioAllList=$scope.cpDTO.scenarioList||[];//[{code:"-1",name:'全部场景'},{code:"-2",name:'当前场景'}].concat(
                    $scope.changeScenario();
                }
                if($scope.type=="new"){
                    //新建加载模板
                    $scope.queryPromise_ep=apiPredicator.getTemplateId({type:0,strategyId:$scope.strategyId,predicatorId :$scope.predicatorId},getInfo);
                }else{
                    //修改加载详情
                    $scope.queryPromise_ep=apiPredicator.getId({predicatorId :$scope.predicatorId},getInfo);
                }
            });

        };
        $scope.init();



        //验证场景
        $scope.validate_scenario = function () {
            if( $scope.cpDTO.scenarioIsShow=='1'){
                return true;
            }
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.cpDTO.scenarioTypeCode) {
                $scope.tip_scenario = {invalid: true, info: '请选择场景'};
            } else {
                $scope.tip_scenario = {invalid: false, info: ''};
            }
            return !$scope.tip_scenario.invalid;
        };
        //验证锦囊
        $scope.validate_solution = function () {
            if( !$scope.isSolutionShow()){
                return true;
            }
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.cpDTO.solutionId) {
                $scope.tip_solution = {invalid: true, info: '请选择锦囊'};
            } else {
                $scope.tip_solution = {invalid: false, info: ''};
            }
            return !$scope.tip_solution.invalid;
        };
        //验证指标名称
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};            
            $scope.tip_name = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            if ($scope.cpDTO.name === '') {
                $scope.tip_name = {invalid: true, info: '指标名称不能为空'};
            }
            else if (!namePattern.test($scope.cpDTO.name)) {
                $scope.tip_name = {invalid: true, info: '指标名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            }
            else {
                
                if($scope.type=="edit" && $scope.editOldName==$scope.cpDTO.name){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiPredicator.getNameUsed({strategyId:$scope.strategyId, name:$scope.cpDTO.name}, function (data) {
                        if (data.result=="0") {
                            $scope.tip_name = {invalid: false, info: '指标名称重复'};
                        } else {
                            $scope.tip_name = {invalid: false, info: ''};
                        }
                    });
                }
            }
            return !$scope.tip_name.invalid;
        };
        //验证必填项
        $scope.validate_parameter = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var retFlag=true;
            for(var i=0;i<$scope.cpDTO.predicatorParameterDTOs.length;i++){
                for(var i1=0;i1<$scope.cpDTO.predicatorParameterDTOs[i].parameterElementDTOs.length;i1++){
                    var peDTO = $scope.cpDTO.predicatorParameterDTOs[i].parameterElementDTOs[i1];
                    if(peDTO.isEmpty == "1"){
                        if($scope.elementType0(peDTO)&&peDTO.dictionaryList&&peDTO.dictionaryList.length>0){
                            if(!peDTO.valueTmp&&peDTO.valueTmp!==0){
                                retFlag = retFlag&&false;
                            }       
                        }else if(!peDTO.value&&peDTO.value!==0){
                            retFlag = retFlag&&false;
                        }
                    }
                }
            }
            if(retFlag){
                $scope.tip_parameter = {invalid: false, info: ''};
            }else{
                $scope.tip_parameter = {invalid: true, info: '请先填写必填项'};
            }
            return !$scope.tip_parameter.invalid;
        }
        //验证条件条件组
        $scope.validate_condition = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if(!$scope.cpDTO.extraFilter||!$scope.cpDTO.extraFilter.filterDTOs){
                $scope.tip_condition = {invalid: false, info: ''};
                return true;
            }
            function isPInt(str) {
                var g = /^[1-9]*[1-9][0-9]*$/;
                return g.test(str);
            }
            function checkDataValue(ent){
                var _count=0;
                if(!ent.leftEnt){
                    _count++;
                }
                if(!ent.rightEnt){
                    _count++;
                }
                if(!ent.optionEnt){
                    _count++;
                }
                if(_count==0||_count==3){
                    return true;
                }else{
                    return false;
                }
            }
            var retFlag=true;
            for(var i=0;i<$scope.cpDTO.extraFilter.filterDTOs.length;i++){
                retFlag = checkDataValue($scope.cpDTO.extraFilter.filterDTOs[i])&&retFlag;
            }

            if(retFlag){
                $scope.tip_condition = {invalid: false, info: ''};
            }else{
                $scope.tip_condition = {invalid: true, info: '请正确输入过滤条件'};
            }
            return !$scope.tip_condition.invalid;
        };
        //验证特殊条件条件组
        $scope.validate_condition2 = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if(!$scope.cpDTO.specialFilter||!$scope.cpDTO.specialFilter.filterDTOs){
                $scope.tip_condition2 = {invalid: false, info: ''};
                return true;
            }
            function isPInt(str) {
                var g = /^[1-9]*[1-9][0-9]*$/;
                return g.test(str);
            }
            function checkDataValue(ent){
                var _count=0;
                if(!ent.leftEnt){
                    _count++;
                }
                if(!ent.rightEnt){
                    _count++;
                }
                if(!ent.optionEnt){
                    _count++;
                }
                if(_count==0||_count==3){
                    return true;
                }else{
                    return false;
                }
            }
            var retFlag=true;
            for(var i=0;i<$scope.cpDTO.specialFilter.filterDTOs.length;i++){
                retFlag = checkDataValue($scope.cpDTO.specialFilter.filterDTOs[i])&&retFlag;
            }

            if(retFlag){
                $scope.tip_condition2 = {invalid: false, info: ''};
            }else{
                $scope.tip_condition2 = {invalid: true, info: '请正确输入过滤条件'};
            }
            return !$scope.tip_condition2.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_scenario() & $scope.validate_solution() & $scope.validate_name() & $scope.validate_condition() & $scope.validate_parameter();
            if($scope.cpDTO.specialFilterIsShow=="0"){
                isRight=isRight & $scope.validate_condition2();
            }
            if(isRight) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };
        
    })
    //数据服务
    .controller('editPredicator1Controller', function ($scope,$q,$state,$stateParams,$uibModal,$rightSlideDialog,apiStrategy,apiSolution,apiRule,apiPredicator,apiParameter,RuleInstance,apiNameList) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.type  = $stateParams.type;      
        $scope.predicatorId = $stateParams.predicatorId;
        $scope.noslide = $stateParams.noslide;
        if(!$scope.type){
            $state.go('ruleCenter');
            return;
        }
        $scope.close = function(){
            $rightSlideDialog.close('edit_predicator1');
        }
        $scope.back = function(){
            $state.go("newPredicator",{noslide:'1'});
        }
        $scope.save = function(){
            if($scope.type=="edit"){
                apiPredicator.putUsedStatus({strategyId:$scope.strategyId, predicatorId:$scope.predicatorId},function(data){
                    if(data.result=="1"){
                         $scope.saveStep2();
                    }else{
                        data.type="修改";
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
            }else{
                $scope.saveStep2();
            }
        }
        $scope.saveStep2 = function(){
            if ($scope.validate()) {
                for(var i=0;i<$scope.pmDto.invokeParameterDTOs.length;i++){
                    var _tmp = $scope.pmDto.invokeParameterDTOs[i];
                    if(_tmp.type=="0"&&_tmp.valueTypeDTO.type=='date'){
                        if(!_tmp.value){
                            _tmp.value=new Date;                            
                        }
                        _tmp.value = _tmp.value.getFullYear()
                            +("0"+_tmp.value.getMonth()).slice(-2)
                            +("0"+_tmp.value.getDate()).slice(-2)
                            +("0"+_tmp.value.getHours()).slice(-2)
                            +("0"+_tmp.value.getMinutes()).slice(-2)
                            +("0"+_tmp.value.getSeconds()).slice(-2);
                    }else if((_tmp.type=='3'||_tmp.type=='4'||_tmp.type=='5'||_tmp.type=='6')&&_tmp.canExtend=='0'){
                        for(var i1=_tmp.value.length;i1--;){
                            if(_tmp.value[i1]==-1){
                                _tmp.value="";
                                break;
                            }else if(!_tmp.value[i1]){
                                _tmp.value.splice(i1,1);
                            }else if(_tmp.value.indexOf(_tmp.value[i1])!=i1){
                                _tmp.value.splice(i1,1);
                            }
                        }
                        _tmp.value=_tmp.value+"";
                    }
                }
                if($scope.pmDto.resultAttributeName){
                    for(var i=0;i<$scope.pmDto.resultContent.length;i++){
                        if($scope.pmDto.resultContent[i].resultAttributeName==$scope.pmDto.resultAttributeName){
                            $scope.pmDto.isUseDic=$scope.pmDto.resultContent[i].isUseDic;
                            $scope.pmDto.comparedValueDic=$scope.pmDto.resultContent[i].comparedValueDic;
                            $scope.pmDto.resultAttribute=$scope.pmDto.resultContent[i].resultAttribute;
                            $scope.pmDto.resultAttributeTypeId=$scope.pmDto.resultContent[i].resultAttributeType.id;
                            $scope.pmDto.resultAttributeTypeName=$scope.pmDto.resultContent[i].resultAttributeType.name;
                        }
                    }
                }                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="new"){
                    $scope.allDto.name=$scope.pmDto.name;
                    apiPredicator.post($scope.allDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    $scope.allDto.name=$scope.pmDto.name;
                    $scope.allDto.id = $scope.predicatorId;
                    $scope.allDto.predicatorId = $scope.predicatorId;
                    apiPredicator.putId($scope.allDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
            }
            
        }
        $scope.changeIsCheck = function(ent){
            if(ent.isCheck=="0"){
                ent.isCheck="1";
            }else{
                ent.isCheck="0";
            }
        }
        $scope.inDtonumberChange = function(ent){
            if(!ent.value||ent.value-0<0){
                ent.value=0;
            }
        }
        $scope.categoryList = {
            category1:[],
            category2:[],
            category3:[],
            category4:[],
            category5:[]
        }

        $scope.inDtoType3Change = function(ent){
            if(ent.type==3){
                apiNameList.getId({nameListId:ent.value},function(data){
                    $scope.categoryList["category1"]=data.category1;
                    $scope.categoryList["category2"]=data.category2;
                    $scope.categoryList["category3"]=data.category3;
                    $scope.categoryList["category4"]=data.category4;
                    $scope.categoryList["category5"]=data.category5;
                })
            }
        }
        
        $scope.dateOptions = {
            formatYear: 'yy',
            maxDate: new Date(2030, 12, 31),
            minDate: new Date(1900, 1, 1),
            startingDay: 1
        };
        $scope.optionList = [
            {id:"day",name:"天"},
            {id:"month",name:"月"}
        ];

        $scope.isEmptyShow = function (ent) {
            return ent.isEmpty=='1'?'必填项':' ';
        }
        //可扩展字段添加、删除
        $scope.addCanExtend = function (ent) {
            ent.value.push("");
        }
        $scope.deleteCanExtend = function (ent,index) {
            ent.value.splice(index,1);
        }
        //初始获取参数
        $scope.init = function () {
            if($scope.type=="new"){                
                $scope.queryPromise_ep1=apiPredicator.getTemplateId({type:1,strategyId:$scope.strategyId,predicatorId :$scope.predicatorId},function(data){
                    $scope.allDto=data;
                    $scope.allDto.status="1";
                    $scope.pmDto=data.dataServiceInvokePredicatorDTO;
                    for(var i=0;i<$scope.pmDto.invokeParameterDTOs.length;i++){
                        var _tmp = $scope.pmDto.invokeParameterDTOs[i];
                        if(_tmp.type=="0"&&_tmp.valueTypeDTO.type=='date'){
                            if(!_tmp.value){
                                var _date=new Date;
                                _tmp.value = _date.getFullYear()+("0"+_date.getMonth()).slice(-2)+("0"+_date.getHours()).slice(-2)+"000000";
                            }
                            _tmp.value = new Date(_tmp.value.substr(0,4),_tmp.value.substr(4,2),_tmp.value.substr(6,2),_tmp.value.substr(8,2),_tmp.value.substr(10,2),_tmp.value.substr(12,2));
                        }else if((_tmp.type=='3'||_tmp.type=='4'||_tmp.type=='5'||_tmp.type=='6')&&_tmp.canExtend=='0'){
                            if(_tmp.value){
                                _tmp.value=_tmp.value.split(",");
                                if(_tmp.length==0){
                                    _tmp.value=[""];
                                }
                            }else{
                                _tmp.value=[""];
                            }
                            _tmp.choiceParameters["-1"]="不限类型";
                        }
                    }
                 });
            }else{
                $scope.queryPromise_ep1=apiPredicator.getId({predicatorId :$scope.predicatorId},function(data){
                    $scope.editOldName = data.name;
                    $scope.allDto=data;
                    $scope.pmDto=data.dataServiceInvokePredicatorDTO;
                    for(var i=0;i<$scope.pmDto.invokeParameterDTOs.length;i++){
                        var _tmp = $scope.pmDto.invokeParameterDTOs[i];
                        $scope.inDtoType3Change(_tmp);
                        if(_tmp.type=="0"&&_tmp.valueTypeDTO.type=='date'){
                            if(!_tmp.value){
                                var _date=new Date;
                                _tmp.value = _date.getFullYear()+("0"+_date.getMonth()).slice(-2)+("0"+_date.getHours()).slice(-2)+"000000";
                            }
                            _tmp.value = new Date(_tmp.value.substr(0,4),_tmp.value.substr(4,2),_tmp.value.substr(6,2),_tmp.value.substr(8,2),_tmp.value.substr(10,2),_tmp.value.substr(12,2));
                        }else if(_tmp.type=="2"){
                            if(!_tmp.value){
                                _tmp.value=0;
                            }
                            _tmp.value = _tmp.value-0;
                        }else if((_tmp.type=='3'||_tmp.type=='4'||_tmp.type=='5'||_tmp.type=='6')&&_tmp.canExtend=='0'){
                            if(_tmp.value){
                                _tmp.value=_tmp.value.split(",");
                                if(_tmp.length==0){
                                    _tmp.value=[""];
                                }
                            }else{
                                _tmp.value=["-1"];
                            }
                            _tmp.choiceParameters["-1"]="不限类型";
                        }
                    }
                });
            }
        };
        $scope.init();

        //验证指标名称
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};            
            $scope.tip_name = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            if ($scope.pmDto.name === '') {
                $scope.tip_name = {invalid: true, info: '指标名称不能为空'};
            }
            else if (!namePattern.test($scope.pmDto.name)) {
                $scope.tip_name = {invalid: true, info: '指标名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            }
            else {                
                if($scope.type=="edit" && $scope.editOldName==$scope.pmDto.name){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiPredicator.getNameUsed({strategyId:$scope.strategyId, name:$scope.pmDto.name}, function (data) {
                        if (data.result=="0") {
                            $scope.tip_name = {invalid: false, info: '指标名称重复'};
                        } else {
                            $scope.tip_name = {invalid: false, info: ''};
                        }
                    });
                }
            }
            return !$scope.tip_name.invalid;
        };
        //验证必填项
        $scope.validate_factor = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var retFlag=true;
            for(var i=0;i<$scope.pmDto.invokeParameterDTOs.length;i++){
                var _tmp = $scope.pmDto.invokeParameterDTOs[i];
                if(_tmp.isEmpty == "1"&&_tmp.isShow != "1"){
                    if(_tmp.type=='1'&&!_tmp.parameterId){
                        retFlag = retFlag&&false;
                    } else if (_tmp.type=='2'&&((!_tmp.value&&_tmp.value!==0)||!_tmp.unit)){
                        retFlag = retFlag&&false;
                    } else if (_tmp.type!='1'&&_tmp.type!='2'&&!_tmp.value&&_tmp.value!==0){
                        retFlag = retFlag&&false;
                    }
                }
            }
            if(retFlag){
                $scope.tip_factor = {invalid: false, info: ''};
            }else{
                $scope.tip_factor = {invalid: true, info: '请先填写必填项'};
            }
            return !$scope.tip_factor.invalid;
        };
        //验证查询结果
        $scope.validate_select = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if($scope.pmDto.resultContent.length==0){
                $scope.tip_select = {invalid: false, info: ''};
            }else{
                if(!$scope.pmDto.resultAttributeName){
                    $scope.tip_select = {invalid: true, info: '请先填写查询结果'};
                }else{
                    $scope.tip_select = {invalid: false, info: ''};
                }
            }
            return !$scope.tip_select.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_name() & $scope.validate_factor() & $scope.validate_select();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };

    })
    //指标计算
    .controller('editPredicator2Controller', function ($scope,$q,$state,$stateParams,$uibModal,$rightSlideDialog,apiStrategy,apiSolution,apiRule,apiPredicator,apiParameter,RuleInstance) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.type  = $stateParams.type;      
        $scope.predicatorId = $stateParams.predicatorId;
        $scope.noslide = $stateParams.noslide;
        if(!$scope.type){
            $state.go('ruleCenter');
            return;
        }
        $scope.close = function(){
            $rightSlideDialog.close("edit_predicator2");
        }
        $scope.back = function(){
            $state.go("newPredicator",{noslide:'1'});
        }
        $scope.save = function(){
            if($scope.type=="edit"){
                apiPredicator.putUsedStatus({strategyId:$scope.strategyId, predicatorId:$scope.predicatorId},function(data){
                    if(data.result=="1"){
                         $scope.saveStep2();
                    }else{                        
                        data.type="修改";
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
            }else{
                $scope.saveStep2();
            }
        }
        
        $scope.saveStep2 = function(){
            if ($scope.validate()) {
                // "type":"1",0：指标，1：字段，2：数值
                for(var i=0;i<$scope.opDto.calculationFactorDTOs.length;i++){
                    var ent = $scope.opDto.calculationFactorDTOs[i];
                    ent.index=i;
                    if(!ent.tmpValue){
                        $scope.opDto.calculationFactorDTOs.splice(index,1);
                    } else if(!ent.tmpValue.id){
                        ent.type=2;
                        ent.value=ent.tmpValue;
                    } else if(ent.tmpValue.id && ent.tmpValue.type==0){
                        ent.type = 0;
                        ent.predicatorId=ent.tmpValue.id;
                        ent.predicatorName=ent.tmpValue.name;
                        ent.valueTypeId=ent.tmpValue.valueTypeId;
                    } else if(ent.tmpValue.id && ent.tmpValue.type==1){
                        ent.type = 1;
                        ent.parameterId=ent.tmpValue.id;
                        ent.parameterName=ent.tmpValue.name;
                        ent.valueTypeId=ent.tmpValue.valueTypeId;                        
                    }else{
                        $scope.opDto.calculationFactorDTOs.splice(index,1);
                    }
                }                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="new"){
                    apiPredicator.post($scope.pmDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    $scope.pmDto.id = $scope.predicatorId;
                    $scope.pmDto.predicatorId = $scope.predicatorId;                    
                    $scope.pmDto.functionType=$scope.opDto.functionType;
                    $scope.pmDto.calculationFactorDTOs=$scope.opDto.calculationFactorDTOs;
                    delete $scope.opDto.calculationFactorDTOs;
                    apiPredicator.putId($scope.pmDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
            }
            
        }

        $scope.optionList = [
            {id:"add",name:"加"},
            {id:"reduce",name:"减"},
            {id:"ride",name:"乘"},
            {id:"divide",name:"除"},
            {id:"sum",name:"求和"},
            {id:"avg",name:"求平均"},
            {id:"max",name:"求最大值"},
            {id:"min",name:"求最小值"}
        ];


        $scope.opDto = {
            "calculationFactorDTOs":[{"tmpValue":""},{"tmpValue":""}],
            "functionType":""
        }
        $scope.pmDto = {
            "name" : "",
            "type" : "2",
            "status":"1",
            "description":"对字段或指标做运算",
            "example":"1天内同一身份证号充值金额的最大值与平均值的差值",
            "strategyId" : $scope.strategyId,
            "operationPredicatorDTO" : $scope.opDto
        }  
        //添加、删除过滤条件子类
        $scope.addFactor = function(index){
            $scope.opDto.calculationFactorDTOs.splice(index+1,0,{"tmpValue":""});
        }
        $scope.delFactor = function(index){
            $scope.opDto.calculationFactorDTOs.splice(index,1);
        }


        //初始获取参数
        $scope.init = function () {
            apiPredicator.getOperatoionParameters({strategyId:$scope.strategyId,type:"Number"},function(data){
                $scope.parameterAllList=data;
                if($scope.type=="edit"){
                    for(var i=$scope.parameterAllList.length;i--;){
                        if($scope.parameterAllList[i].id==$scope.predicatorId){
                            $scope.parameterAllList.splice(i,1)
                        }
                    }
                    $scope.getInfo();
                }
            });
        };
        $scope.getInfo = function(){
           $scope.queryPromise_ep2 = apiPredicator.getId({predicatorId :$scope.predicatorId},function(data){
                $scope.editOldName = data.name;
                $scope.pmDto = angular.extend($scope.pmDto,data);
                $scope.opDto = {
                    "calculationFactorDTOs":data.calculationFactorDTOs,
                    "functionType":data.functionType
                };
                $scope.pmDto.operationPredicatorDTO = $scope.opDto;
                for(var i=0;i<$scope.opDto.calculationFactorDTOs.length;i++){
                    var ent = $scope.opDto.calculationFactorDTOs[i];
                    if(ent.type==0||ent.type==1){
                        for(var i1 =0;i1<$scope.parameterAllList.length;i1++){
                            if(($scope.parameterAllList[i1].id==ent.parameterId||$scope.parameterAllList[i1].id==ent.predicatorId)&&$scope.parameterAllList[i1].type==ent.type){
                                ent.tmpValue=$scope.parameterAllList[i1];
                                break;
                            }
                        }
                    } else if(ent.type==2){
                        ent.tmpValue=ent.value;
                    }
                }
            });
        }
        $scope.init();

        //验证指标名称
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};            
            $scope.tip_name = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            if ($scope.pmDto.name === '') {
                $scope.tip_name = {invalid: true, info: '指标名称不能为空'};
            }
            else if (!namePattern.test($scope.pmDto.name)) {
                $scope.tip_name = {invalid: true, info: '指标名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            }
            else {                
                if($scope.type=="edit" && $scope.editOldName==$scope.pmDto.name){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiPredicator.getNameUsed({strategyId:$scope.strategyId, name:$scope.pmDto.name}, function (data) {
                        if (data.result=="0") {
                            $scope.tip_name = {invalid: false, info: '指标名称重复'};
                        } else {
                            $scope.tip_name = {invalid: false, info: ''};
                        }
                    });
                }
            }
            return !$scope.tip_name.invalid;
        };
        //验证运算符
        $scope.validate_function = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.opDto.functionType) {
                $scope.tip_function = {invalid: true, info: '运算符不能为空'};
            } else {
                $scope.tip_function = {invalid: false, info: ''};
            }
            return !$scope.tip_function.invalid;
        };
        //验证运算因子
        $scope.validate_factor = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.opDto.functionType) {
                $scope.tip_factor = {invalid: true, info: ''};
            }else{
                var _count=0;
                for(var i=$scope.opDto.calculationFactorDTOs.length;i--;){
                    if($scope.opDto.calculationFactorDTOs[i].tmpValue){
                        _count++;
                    }
                }
                if(["add","reduce","ride","divide"].indexOf($scope.opDto.functionType)>-1&&_count!=2){
                    $scope.tip_factor = {invalid: true, info: '加、减、乘、除只能有两个运算因子'};
                }else if(["sum","avg","max","min"].indexOf($scope.opDto.functionType)>-1&&_count<2){
                     $scope.tip_factor = {invalid: true, info: '求和、求平均、求最大值、求最小值至少要有两个运算因子'};
                }else{
                    $scope.tip_factor = {invalid: false, info: ''};
                }
            }
            return !$scope.tip_factor.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_name() & $scope.validate_function() & $scope.validate_factor();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };

    })
    //时间差指标
    .controller('editPredicator21Controller', function ($scope,$q,$state,$stateParams,$uibModal,$rightSlideDialog,apiStrategy,apiSolution,apiRule,apiPredicator,apiParameter,RuleInstance) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.type  = $stateParams.type;      
        $scope.predicatorId = $stateParams.predicatorId;
        $scope.noslide = $stateParams.noslide;
        if(!$scope.type){
            $state.go('ruleCenter');
            return;
        }
        $scope.close = function(){
            $rightSlideDialog.close("edit_predicator2_1");
        }
        $scope.back = function(){
            $state.go("newPredicator",{noslide:'1'});
        }
        $scope.save = function(){
            if($scope.type=="edit"){
                apiPredicator.putUsedStatus({strategyId:$scope.strategyId, predicatorId:$scope.predicatorId},function(data){
                    if(data.result=="1"){
                         $scope.saveStep2();
                    }else{
                        data.type="修改";
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
            }else{
                $scope.saveStep2();
            }
        }
        $scope.saveStep2 = function(){
            if ($scope.validate()) {
                // "type":"1",0：指标，1：字段，2：数值
                for(var i=0;i<$scope.opDto.calculationFactorDTOs.length;i++){
                    var ent = $scope.opDto.calculationFactorDTOs[i];
                    ent.index=i;
                    if(ent.tmpValue.type==1){
                        ent.parameterId=ent.tmpValue.id;
                        ent.parameterName=ent.tmpValue.name;
                        ent.valueTypeId=ent.tmpValue.valueTypeId;
                        ent.type=ent.tmpValue.type;
                    }else if(ent.tmpValue.type==0){
                        ent.predicatorId=ent.tmpValue.id;
                        ent.predicatorName=ent.tmpValue.name;
                        ent.valueTypeId=ent.tmpValue.valueTypeId;
                        ent.type=ent.tmpValue.type;
                    }
                    // if(!ent.tmpValue){
                    //     $scope.opDto.calculationFactorDTOs.splice(index,1);
                    // } else if(!ent.tmpValue.id){
                    //     ent.type=2;
                    //     ent.value=ent.tmpValue;
                    // } else if(ent.tmpValue.id && ent.tmpValue.type==0){
                    //     ent.type = 0;
                    //     ent.predicatorId=ent.tmpValue.id;
                    //     ent.predicatorName=ent.tmpValue.name;
                    //     ent.valueTypeId=ent.tmpValue.valueTypeId;
                    // } else if(ent.tmpValue.id && ent.tmpValue.type==1){
                    //     ent.type = 1;
                    //     ent.parameterId=ent.tmpValue.id;
                    //     ent.parameterName=ent.tmpValue.name;
                    //     ent.valueTypeId=ent.tmpValue.valueTypeId;                        
                    // }else{
                    //     $scope.opDto.calculationFactorDTOs.splice(index,1);
                    // }
                }                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="new"){
                    apiPredicator.post($scope.pmDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    $scope.pmDto.id = $scope.predicatorId;
                    $scope.pmDto.predicatorId = $scope.predicatorId;                    
                    $scope.pmDto.functionType=$scope.opDto.functionType;
                    $scope.pmDto.calculationFactorDTOs=$scope.opDto.calculationFactorDTOs;
                    delete $scope.opDto.calculationFactorDTOs;
                    apiPredicator.putId($scope.pmDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;                        
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
            }
            
        }
        
        $scope.optionList = [
            {id:"time_second",name:"秒"},
            {id:"time_minute",name:"分"},
            {id:"time_hour",name:"小时"},
            {id:"time_day",name:"天"}
        ];

        $scope.opDto = {
            "calculationFactorDTOs":[{"tmpValue":""},{"tmpValue":""}],
            "functionType":""
        }
        $scope.pmDto = {
            "name" : "",
            "type" : "2",
            "status":"1",
            "description":"计算两个时间字段或时间指标之间的时间差",
            "example":"机票起飞时间距离下单时间<1小时",
            "strategyId" : $scope.strategyId,
            "operationPredicatorDTO" : $scope.opDto
        }  

        //初始获取参数
        $scope.init = function () {
            apiPredicator.getOperatoionParameters({strategyId:$scope.strategyId,type:"Date"},function(data){
                $scope.parameterAllList=data;
                if($scope.type=="edit"){
                    for(var i=$scope.parameterAllList.length;i--;){
                        if($scope.parameterAllList[i].id==$scope.predicatorId){
                            $scope.parameterAllList.splice(i,1)
                        }
                    }
                    $scope.getInfo();
                }
            });
        };
        $scope.getInfo = function(){
            $scope.queryPromise_ep2_1 = apiPredicator.getId({predicatorId :$scope.predicatorId},function(data){
                $scope.editOldName = data.name;
                $scope.pmDto = angular.extend($scope.pmDto,data);
                if(data.calculationFactorDTOs.length!=2){
                    data.calculationFactorDTOs=[{"tmpValue":""},{"tmpValue":""}];
                }
                $scope.opDto = {
                    "calculationFactorDTOs":data.calculationFactorDTOs,
                    "functionType":data.functionType
                };
                $scope.pmDto.operationPredicatorDTO = $scope.opDto;
                for(var i=0;i<$scope.opDto.calculationFactorDTOs.length;i++){
                    var ent = $scope.opDto.calculationFactorDTOs[i];
                    if(ent.type==0||ent.type==1){
                        for(var i1 =0;i1<$scope.parameterAllList.length;i1++){
                            if(($scope.parameterAllList[i1].id==ent.parameterId||$scope.parameterAllList[i1].id==ent.predicatorId)&&$scope.parameterAllList[i1].type==ent.type){
                                ent.tmpValue=$scope.parameterAllList[i1];
                                break;
                            }
                        }
                    } else if(ent.type==2){
                        ent.tmpValue=ent.value;
                    }
                }
            });
        }
        $scope.init();

        //验证指标名称
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};            
            $scope.tip_name = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            if ($scope.pmDto.name === '') {
                $scope.tip_name = {invalid: true, info: '指标名称不能为空'};
            }
            else if (!namePattern.test($scope.pmDto.name)) {
                $scope.tip_name = {invalid: true, info: '指标名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            }
            else {                
                if($scope.type=="edit" && $scope.editOldName==$scope.pmDto.name){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiPredicator.getNameUsed({strategyId:$scope.strategyId, name:$scope.pmDto.name}, function (data) {
                        if (data.result=="0") {
                            $scope.tip_name = {invalid: false, info: '指标名称重复'};
                        } else {
                            $scope.tip_name = {invalid: false, info: ''};
                        }
                    });
                }
            }
            return !$scope.tip_name.invalid;
        };
        //验证操作符
        $scope.validate_function = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.opDto.functionType) {
                $scope.tip_function = {invalid: true, info: '单位不能为空'};
            } else {
                $scope.tip_function = {invalid: false, info: ''};
            }
            return !$scope.tip_function.invalid;
        };
        //验证获取时间
        $scope.validate_factorA = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.opDto.calculationFactorDTOs[0].tmpValue) {
                $scope.tip_factora = {invalid: true, info: '时间A不能为空'};
            } else {
                $scope.tip_factora = {invalid: false, info: ''};
            }
            return !$scope.tip_factora.invalid;
        };
        $scope.validate_factorB = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.opDto.calculationFactorDTOs[1].tmpValue) {
                $scope.tip_factorb = {invalid: true, info: '时间B不能为空'};
            } else {
                $scope.tip_factorb = {invalid: false, info: ''};
            }
            return !$scope.tip_factorb.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_name() & $scope.validate_function() & $scope.validate_factorA() & $scope.validate_factorB();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };

    })
    //距离差指标
    .controller('editPredicator22Controller', function ($scope,$q,$state,$stateParams,$uibModal,$rightSlideDialog,apiStrategy,apiSolution,apiRule,apiPredicator,apiParameter,RuleInstance) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.type  = $stateParams.type;      
        $scope.predicatorId = $stateParams.predicatorId;
        $scope.noslide = $stateParams.noslide;
        if(!$scope.type){
            $state.go('ruleCenter');
            return;
        }
        $scope.close = function(){
            $rightSlideDialog.close("edit_predicator2_2");
        }
        $scope.back = function(){
            $state.go("newPredicator",{noslide:'1'});
        }
        $scope.save = function(){
            if($scope.type=="edit"){
                apiPredicator.putUsedStatus({strategyId:$scope.strategyId, predicatorId:$scope.predicatorId},function(data){
                    if(data.result=="1"){
                         $scope.saveStep2();
                    }else{
                        data.type="修改";
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
            }else{
                $scope.saveStep2();
            }
        }
        
        $scope.saveStep2 = function(){
            if ($scope.validate()) {
                // "type":"1",0：指标，1：字段，2：数值
                for(var i=0;i<$scope.opDto.calculationFactorDTOs.length;i++){
                    var ent = $scope.opDto.calculationFactorDTOs[i];
                    ent.index=i;
                    if(ent.tmpValue.type==1){
                        ent.parameterId=ent.tmpValue.id;
                        ent.parameterName=ent.tmpValue.name;
                        ent.valueTypeId=ent.tmpValue.valueTypeId;
                        ent.type=ent.tmpValue.type;
                    }else if(ent.tmpValue.type==0){
                        ent.predicatorId=ent.tmpValue.id;
                        ent.predicatorName=ent.tmpValue.name;
                        ent.valueTypeId=ent.tmpValue.valueTypeId;
                        ent.type=ent.tmpValue.type;
                    }
                    // if(!ent.tmpValue){
                    //     $scope.opDto.calculationFactorDTOs.splice(index,1);
                    // } else if(!ent.tmpValue.id){
                    //     ent.type=2;
                    //     ent.value=ent.tmpValue;
                    // } else if(ent.tmpValue.id && ent.tmpValue.type==0){
                    //     ent.type = 0;
                    //     ent.predicatorId=ent.tmpValue.id;
                    //     ent.predicatorName=ent.tmpValue.name;
                    //     ent.valueTypeId=ent.tmpValue.valueTypeId;
                    // } else if(ent.tmpValue.id && ent.tmpValue.type==1){
                    //     ent.type = 1;
                    //     ent.parameterId=ent.tmpValue.id;
                    //     ent.parameterName=ent.tmpValue.name;
                    //     ent.valueTypeId=ent.tmpValue.valueTypeId;                        
                    // }else{
                    //     $scope.opDto.calculationFactorDTOs.splice(index,1);
                    // }
                }                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="new"){
                    apiPredicator.post($scope.pmDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    $scope.pmDto.id = $scope.predicatorId;
                    $scope.pmDto.predicatorId = $scope.predicatorId;                    
                    $scope.pmDto.functionType=$scope.opDto.functionType;
                    $scope.pmDto.calculationFactorDTOs=$scope.opDto.calculationFactorDTOs;
                    delete $scope.opDto.calculationFactorDTOs;
                    apiPredicator.putId($scope.pmDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
            }
            
        }


        $scope.opDto = {
            "calculationFactorDTOs":[{"tmpValue":""},{"tmpValue":""}],
            "functionType":"distance"
        }
        $scope.pmDto = {
            "name" : "",
            "type" : "2",
            "status":"1",
            "description":"计算两个经纬度字段或经纬度指标之间的距离差，单位为千米",
            "example":"用户当前位置与商家位置的距离",
            "strategyId" : $scope.strategyId,
            "operationPredicatorDTO" : $scope.opDto
        }  
        //添加、删除过滤条件子类
        $scope.addFactor = function(index){
            $scope.opDto.calculationFactorDTOs.splice(index+1,0,{"tmpValue":""});
        }
        $scope.delFactor = function(index){
            $scope.opDto.calculationFactorDTOs.splice(index,1);
        }


        //初始获取参数
        $scope.init = function () {
            apiPredicator.getOperatoionParameters({strategyId:$scope.strategyId,type:"GPS"},function(data){
                $scope.parameterAllList=data;
                if($scope.type=="edit"){
                    for(var i=$scope.parameterAllList.length;i--;){
                        if($scope.parameterAllList[i].id==$scope.predicatorId){
                            $scope.parameterAllList.splice(i,1)
                        }
                    }
                    $scope.getInfo();
                }
            });
        };
        $scope.getInfo = function(){
            $scope.queryPromise_ep2_2 = apiPredicator.getId({predicatorId :$scope.predicatorId},function(data){
                $scope.editOldName = data.name;
                $scope.pmDto = angular.extend($scope.pmDto,data);
                if(data.calculationFactorDTOs.length!=2){
                    data.calculationFactorDTOs=[{"tmpValue":""},{"tmpValue":""}]
                }
                $scope.opDto = {
                    "calculationFactorDTOs":data.calculationFactorDTOs,
                    "functionType":data.functionType
                };
                $scope.pmDto.operationPredicatorDTO = $scope.opDto;
                for(var i=0;i<$scope.opDto.calculationFactorDTOs.length;i++){
                    var ent = $scope.opDto.calculationFactorDTOs[i];
                    if(ent.type==0||ent.type==1){
                        for(var i1 =0;i1<$scope.parameterAllList.length;i1++){
                            if(($scope.parameterAllList[i1].id==ent.parameterId||$scope.parameterAllList[i1].id==ent.predicatorId)&&$scope.parameterAllList[i1].type==ent.type){
                                ent.tmpValue=$scope.parameterAllList[i1];
                                break;
                            }
                        }
                    } else if(ent.type==2){
                        ent.tmpValue=ent.value;
                    }
                }
            });
        }
        $scope.init();

        //验证指标名称
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};            
            $scope.tip_name = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            if ($scope.pmDto.name === '') {
                $scope.tip_name = {invalid: true, info: '指标名称不能为空'};
            }
            else if (!namePattern.test($scope.pmDto.name)) {
                $scope.tip_name = {invalid: true, info: '指标名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            }
            else {                
                if($scope.type=="edit" && $scope.editOldName==$scope.pmDto.name){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiPredicator.getNameUsed({strategyId:$scope.strategyId, name:$scope.pmDto.name}, function (data) {
                        if (data.result=="0") {
                            $scope.tip_name = {invalid: false, info: '指标名称重复'};
                        } else {
                            $scope.tip_name = {invalid: false, info: ''};
                        }
                    });
                }
            }
            return !$scope.tip_name.invalid;
        };
        //验证获取时间
        $scope.validate_factorA = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.opDto.calculationFactorDTOs[0].tmpValue) {
                $scope.tip_factora = {invalid: true, info: '位置A不能为空'};
            } else {
                $scope.tip_factora = {invalid: false, info: ''};
            }
            return !$scope.tip_factora.invalid;
        };
        $scope.validate_factorB = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.opDto.calculationFactorDTOs[1].tmpValue) {
                $scope.tip_factorb = {invalid: true, info: '位置B不能为空'};
            } else {
                $scope.tip_factorb = {invalid: false, info: ''};
            }
            return !$scope.tip_factorb.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_name() &  $scope.validate_factorA() & $scope.validate_factorB();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };

    })
    //取值指标
    .controller('editPredicator3Controller', function ($scope,$q,$state,$stateParams,$sce,$uibModal,$rightSlideDialog,apiStrategy,apiSolution,apiRule,apiPredicator,apiParameter,RuleInstance) {
        $scope.strategyId = $stateParams.strategyId;
        $scope.type  = $stateParams.type;      
        $scope.predicatorId = $stateParams.predicatorId;
        $scope.noslide = $stateParams.noslide;
        if(!$scope.type){
            $state.go('ruleCenter');
            return;
        }
        $scope.methodTypehtmlTooltip = $sce.trustAsHtml('1)获取小时：获取日期字段或日期指标的所在的小时，范围是0-23的整数</br>2)获取天：获取日期字段或日期指标所在的日期，范围是1-31的整数</br>3)获取星期：获取日期字段或日期指标是星期几，范围是0-6的整数，分别对应周日-周六</br>4）获取月：获取日期字段或日期指标所在的月份，范围是1-12的整数');
        $scope.close = function(){
            $rightSlideDialog.close("edit_predicator3");
        }
        $scope.back = function(){
            $state.go("newPredicator",{noslide:'1'});
        }
        $scope.save = function(){
            if($scope.type=="edit"){
                apiPredicator.putUsedStatus({strategyId:$scope.strategyId, predicatorId:$scope.predicatorId},function(data){
                    if(data.result=="1"){
                         $scope.saveStep2();
                    }else{
                        data.type="修改";
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
            }else{
                $scope.saveStep2();
            }
        }

        $scope.saveStep2 = function(){
            if ($scope.validate()) {
                // "type":"1",0：指标，1：字段，2：数值
                
                if($scope.gvfDto.tmpEnt.type==0){
                    $scope.gvfDto.type=0;
                    $scope.gvfDto.predicatorId=$scope.gvfDto.tmpEnt.id;
                    $scope.gvfDto.predicatorName=$scope.gvfDto.tmpEnt.name;
                } else if($scope.gvfDto.tmpEnt.type==1){
                    $scope.gvfDto.type = 1;
                    $scope.gvfDto.parameterId=$scope.gvfDto.tmpEnt.id;
                    $scope.gvfDto.parameterName=$scope.gvfDto.tmpEnt.name;                      
                }                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;            
                if($scope.type=="new"){
                    apiPredicator.post($scope.pmDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    $scope.pmDto.id = $scope.predicatorId;
                    $scope.pmDto.predicatorId = $scope.predicatorId; 
                    apiPredicator.putId($scope.pmDto,function(result){
                        RuleInstance.selectPredicators();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
            }
            
        }
        $scope.optionList = [
            {id:"hour",name:"小时"},
            {id:"day",name:"天"},
            {id:"week",name:"星期"},
            {id:"month",name:"月"}
            // {id:"minute",name:"分"},
            // {id:"second",name:"秒"},
            // {id:"millisecond",name:"毫秒"}
        ];
        $scope.gvfDto = {
            "tmpEnt":"",
            "methodType":""
        }
        $scope.pmDto = {
            "name" : "",
            "type" : "3",
            "status":"1",
            "description":"获取时间字段或时间指标的时间点",
            "example":"注册时间所在的小时",
            "strategyId" : $scope.strategyId,
            "getValueFactorDTO" : $scope.gvfDto
        }  
        //初始获取参数
        $scope.init = function () {
            apiPredicator.getOperatoionParameters({strategyId:$scope.strategyId,type:"Date"},function(data){
                $scope.parameterAllList=data;
                if($scope.type=="edit"){
                    for(var i=$scope.parameterAllList.length;i--;){
                        if($scope.parameterAllList[i].id==$scope.predicatorId){
                            $scope.parameterAllList.splice(i,1)
                        }
                    }
                    $scope.getInfo();
                }
            });
        };
        $scope.getInfo = function(){
            apiPredicator.getId({predicatorId :$scope.predicatorId},function(data){
                $scope.editOldName = data.name;
                $scope.pmDto=angular.extend($scope.pmDto,data);
                $scope.gvfDto=$scope.pmDto.getValueFactorDTO;
                for(var i=$scope.parameterAllList.length;i--;){
                    if($scope.parameterAllList[i].type==$scope.gvfDto.type){
                        if($scope.gvfDto.type==0&&$scope.gvfDto.predicatorId==$scope.parameterAllList[i].id){
                            $scope.gvfDto.tmpEnt=$scope.parameterAllList[i];
                        } else if($scope.gvfDto.type==1&&$scope.gvfDto.parameterId==$scope.parameterAllList[i].id){
                            $scope.gvfDto.tmpEnt=$scope.parameterAllList[i];
                        }
                    }
                }
            });
        }
        $scope.init();

        //验证指标名称
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};            
            $scope.tip_name = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            if (!$scope.pmDto.name) {
                $scope.tip_name = {invalid: true, info: '指标名称不能为空'};
            }
            else if (!namePattern.test($scope.pmDto.name)) {
                $scope.tip_name = {invalid: true, info: '指标名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            }
            else {                
                if($scope.type=="edit" && $scope.editOldName==$scope.pmDto.name){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiPredicator.getNameUsed({strategyId:$scope.strategyId, name:$scope.pmDto.name}, function (data) {
                        if (data.result=="0") {
                            $scope.tip_name = {invalid: false, info: '指标名称重复'};
                        } else {
                            $scope.tip_name = {invalid: false, info: ''};
                        }
                    });
                }
            }
            return !$scope.tip_name.invalid;
        };
        $scope.validate_function = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if ($scope.gvfDto.tmpEnt==="") {
                $scope.tip_function = {invalid: true, info: '请选择时间字段或指标'};
            } else {
                $scope.tip_function = {invalid: false, info: ''};
            }
            return !$scope.tip_function.invalid;
        };
        $scope.validate_factor = function () {
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.gvfDto.methodType) {
                $scope.tip_factor = {invalid: true, info: '请选择日期函数'};
            }else{
                $scope.tip_factor = {invalid: false, info: ''};
            }
            return !$scope.tip_factor.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_name() & $scope.validate_function() & $scope.validate_factor();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };

    })
    ;