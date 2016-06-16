'use strict';

angular.module('cloudxWebApp')
    .controller('EventLogDetailController', function ($scope, $state, $stateParams,$uibModal, $rightSlideDialog, apiEventLog, $location, $anchorScroll,EventLogInstance, apiParameter) {

        $scope.eventlogid = $stateParams.eventlogid;
        $scope.esEventLogId = $stateParams.esEventLogId;
        $scope.titleList = {
            "riskPolicyDetails":"风险详情",
            "geographyDetails":"地理位置",
            "fingerPrintDetails":"设备环境",
            "businessDataDetails":"业务数据"
        };
        $scope.policyMap = {
            'pass': '放行',
            'deny': '阻止',
            'review': '人工审核'
        }
        $scope.activeIndex="riskPolicyDetails";
        $scope.changeBar = function(value){
            $scope.activeIndex=value;
            $location.hash(value);
            $anchorScroll();
        }
        //规则详情
        $scope.showRuleInfo = function(rule) {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'EventLogRule.html',
                controller: 'EventLogRuleController',
                resolve: {
                    serviceCode: function () {
                        return rule;
                    }
                }
            });
        }
        //添加名单
        $scope.addNameList = function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'AddNameListFromEvent.html',
                controller: 'AddNameListFromEventController',
                resolve: {
                    serviceCode: function () {
                        return {
                            eventLogId:$scope.eventlogid
                        };
                    }
                }
            });
        }
        //添加标记
        $scope.addMark = function() {
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'AddMarkFromEvent.html',
                controller: 'AddMarkFromEventController',
                resolve: {
                    serviceCode: function () {
                        return {
                            eventLogId:$scope.eventlogid,
                            mark:$scope.eventLog.mark,
                            esEventLogId:$scope.esEventLogId
                        };
                    }
                }
            });
        }
        //改变事件标记
        $scope.changeMark = function(){
            if($scope.eventLog.mark=="1"){
                $scope.eventLog.mark="0";
            }else{
                $scope.eventLog.mark="1";
            }
            apiEventLog.putEventLogMark({eventLogId:$scope.eventlogid,result:$scope.eventLog.mark,esEventLogId:$scope.esEventLogId},function(data){
                EventLogInstance.changeMark($scope.eventlogid,$scope.eventLog.mark)
            });
        }
        $scope.changeDetailMark = function(eventLogId, mark) {
            if ($scope.eventlogid == eventLogId) {
                $scope.eventLog.mark = mark;
            }
        }
        EventLogInstance.changeDetailMark=$scope.changeDetailMark;
        //打开新窗口
        $scope.openNewSelect = function(ent){
            if(ent.isLinked=='1'){
                var _value=ent.value;
                if(ent.code && ent.code in $scope.dicMap){
                    _value=$scope.dicMap[ent.code][ent.value]||ent.value;
                }
                window.open('/#/event-log&'+ent.name+'&'+ent.code+'&'+_value);
            }
        }
        //初始获取参数
        $scope.init = function () {
            function getDicText(obj){
                for(var _ent in obj){
                    var _obj=obj[_ent];
                    if(angular.isArray(_obj)||angular.isObject(_obj)){
                        if(_obj.code && _obj.value && _obj.code in $scope.dicMap){
                            _obj.value=$scope.dicMap[_obj.code ][_obj.value]||_obj.value;
                        }else{
                            getDicText(_obj)
                        }
                    }
                }
            }
            apiParameter.getDic({},function(data){
                $scope.dicMap=data;
                apiEventLog.getEventLogId({eventLogId:$scope.eventlogid},function(data){
                    getDicText(data);
                    $scope.eventLog = data;
                    if(!$scope.eventLog.fingerPrintDetails){
                        $scope.eventLog.fingerPrintDetails={
                            fingerPrintList:[]
                        }
                    }
                });
            });

        };
        $scope.showDicText = function(ent){
            // if(ent.code && ent.code in $scope.dicMap){
            //     return $scope.dicMap[ent.code][ent.value]||ent.value;
            // }
            return ent.value;
        }
        $scope.init();
        
    })
    
    .controller('EventLogRuleController', function ($scope,$state, $uibModalInstance, serviceCode) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        //显示其一
        $scope.showOneName = function(name1,name2){
            if(!name2){
                return name1;
            }else if(!name1){
                return name2;
            }else {
                return name1+"，"+name2;
            }
        }
        $scope.ruleInfo = serviceCode;
    })
    .controller('AddNameListFromEventController', function ($scope,$state, $uibModalInstance, serviceCode,apiEventLog,apiNameList) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.eventLogId = serviceCode.eventLogId;
        $scope.init = function () {
            apiNameList.get({},function(data){
                $scope.parameterList = data;
            })
            apiEventLog.getNameList({eventLogId:$scope.eventLogId},function(data){
                $scope.nameList = data;
                for(var i=0;i<$scope.nameList.length;i++){
                    $scope.nameList[i].newChecked=($scope.nameList[i].isChecked=='1'?true:false);
                }
            })
        };
        $scope.init();
        $scope.ok = function () {
            if($scope.validate_parameter()){
                var addedParameters=[];
                for(var i=0;i<$scope.nameList.length;i++){
                    if($scope.nameList[i].isChecked=="0"&&$scope.nameList[i].newChecked){
                        addedParameters.push({
                            code:$scope.nameList[i].code,
                            value:$scope.nameList[i].value
                        })
                    }
                }
                if(addedParameters.length>0){
                    apiNameList.postEventLog({nameListId:$scope.listDefinitionId,eventLogId:$scope.eventLogId,listDefinitionId:$scope.listDefinitionId,addedParameters:addedParameters},function(data){
                        $uibModalInstance.dismiss();
                    })
                }else{
                    $uibModalInstance.dismiss();
                }
            }
        };
        //验证名单
        $scope.validate_parameter = function () {
            if (!$scope.listDefinitionId) {
                $scope.tip_parameter = {invalid: true, info: '请选择名单'};
            } else {
                $scope.tip_parameter = {invalid: false, info: ''};
            }
            return !$scope.tip_parameter.invalid;
        };
    })
    .controller('AddMarkFromEventController', function ($scope,$state, $uibModalInstance, serviceCode,EventLogInstance,apiEventLog) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.data = serviceCode;
        $scope.changeDataMark = function (mark) {
            if($scope.data.mark==mark){
                $scope.data.mark="";
            }else{
                $scope.data.mark=mark;
            }
        }
        $scope.ok = function () {
            apiEventLog.putEventLogMark({eventLogId:$scope.data.eventLogId,result:$scope.data.mark,esEventLogId:$scope.data.esEventLogId},function(data){
                EventLogInstance.changeListMark($scope.data.eventLogId,$scope.data.mark);
                EventLogInstance.changeDetailMark($scope.data.eventLogId,$scope.data.mark);
                $uibModalInstance.dismiss();
            });
        };
    })
    