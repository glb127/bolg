'use strict';

angular.module('cloudxWebApp')
    .controller('ParameterListController', function ($scope, $state, $uibModal, $stateParams, apiParameter, ParameterInstance) {
        $scope.typeTrans = {
            "0" : "系统字段",
            "1" : "设备指纹字段",
            "2" : "自定义字段",
            "3" : "自定义解析字段",
            "4" : "系统解析字段" 
        };
        $scope.tFilter={
            dimension:"",
            type:"",
            tran:"",
            status:"",
            keyword:""
        };

        $scope.queryByEnterKey = function(e){
            if(e.charCode==13){
                $scope.parameterSelect();
            }
        }
        $scope.parameterSelect = function(e){
           $scope.tFilter.keyword = $scope.keyword;
        }
        $scope.parameterFilter = function(ent){
            var flag = true;
            if($scope.tFilter.dimension!=''&&$scope.tFilter.dimension!=ent.parameterTagName){
                flag = false;
            }
            if($scope.tFilter.type!=''&&$scope.tFilter.type!=ent.valueTypeName){
                flag = false;
            }
            if($scope.tFilter.tran!=''&&$scope.tFilter.tran!=ent.type){
                flag = false;
            }
            if($scope.tFilter.status!=''&&$scope.tFilter.status!=ent.status){
                flag = false;
            }            
            if($scope.tFilter.keyword != "" && ent.name.indexOf($scope.tFilter.keyword)==-1 && ent.code.indexOf($scope.tFilter.keyword)==-1){
                flag=false;
            }
            return flag;
        }
        //字段维度
        $scope.getTags = function () {
            apiParameter.getTags({},function(data){
                $scope.theDimensions = data;
            });
        }
        //字段类型
        $scope.getValueTypes = function () {
            apiParameter.getValueTypes({},function (data) {
                $scope.theTypes = data;
            }); 
        }
        $scope.selectParameters = function () {
            //每次筛选查询都调用接口，防止其他用户新增后该页面不增加内容，（待考虑是否合适）
            apiParameter.get({},function(data){
                $scope.parameterList = data;
            });
        }
        ParameterInstance.selectParameters=$scope.selectParameters;
        //载入页面时：
        $scope.init = function () {
            $scope.getTags();
            $scope.selectParameters();
            $scope.getValueTypes();
        };
        $scope.init();


        //新建
        $scope.addParameter = function (ent) {          
            $state.go("editParameterList",{type:"new"});
        };
        
        //编辑攻略
        $scope.editParameter = function (ent) {
            //编辑前判断是否能编辑
            apiParameter.getUsedStatus({parameterId:ent.id},function(data){
                if(data.result == 1){
                    //可以编辑
                    $state.go("editParameterList",{type:"edit",detail:ent});
                }else{
                    //不可以编辑
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'editable.html',
                        controller: 'editableController'
                    });
                }
                
            });
        };

        //删除攻略
        $scope.deleteParameter = function (ent) {
            //删除前判断是否能编辑
            apiParameter.getUsedStatus({parameterId:ent.id},function(data){
                if(data.result == 1){
                    //可以删除
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'DeleteParameter.html',
                        controller: 'DeleteParameterController',
                        resolve: {
                            serviceCode: function () {
                                return ent;
                            }
                        }
                    });
                }else{
                    //不可以删除
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'editable.html',
                        controller: 'editableController'
                    });
                }
                
            });
            
        };
        
        //状态开关
        $scope.changeStatus = function (param) {
            if(param.status == 1 ){
                param.status = 0;
            }else {
                param.status = 1;
            }
            apiParameter.changeStatus({parameterId :param.id,status:param.status},function(){

            })
        }
    })

    .controller('DeleteParameterController', function ($scope, $uibModal, $uibModalInstance, serviceCode, apiParameter, ParameterInstance) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.parameterName = serviceCode.name;
        $scope.parameterId = serviceCode.id;
        $scope.ok = function () {
            apiParameter.deleteId({parameterId:$scope.parameterId}, function (result) {
                ParameterInstance.selectParameters();
                $uibModalInstance.close();
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'DeleteParameterOK.html',
                    controller: 'DeleteParameterOKController',
                    resolve: {
                        serviceCode: function () {
                            return result;
                        }
                    }
                });
            });
            
        };
    })
    .controller('DeleteParameterOKController', function ($scope, $timeout, $uibModalInstance, serviceCode) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
            $timeout.cancel(time);
        };
        var time = $timeout(function() {
            $uibModalInstance.dismiss();
        },3000);
        $scope.parameterName = serviceCode.name;
        $scope.parameterId = serviceCode.id;

    })
    .controller('editableController', function ($scope, $timeout, $uibModal, $uibModalInstance) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
            $timeout.cancel(time);
        };
        var time = $timeout(function() {
            $uibModalInstance.dismiss();
        },3000);
        $scope.message = "该字段已应用在规则中，请先删除规则！";
        $scope.ok = function () {
            $uibModalInstance.close();
        };
    })

    .factory('ParameterInstance', function(){

        return {
            selectParameters:angular.noop
        };

    });