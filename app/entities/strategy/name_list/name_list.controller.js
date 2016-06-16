'use strict';

angular.module('cloudxWebApp')
    .controller('NameListsController', function ($scope, $state, $uibModal, $stateParams, apiNameList, NameListInstance) {

        $scope.tmp={};
        $scope.tmp.nameListId="";
        $scope.tmp.value="";
        $scope.per_page=10;

        $scope.queryByEnterKey = function(e){
            if(e.charCode==13){
                $scope.filterDataValues();
            }
        }
        //获取名单列表
        $scope.getNameList = function () {
            apiNameList.get({},function(data){
                $scope.nameList=data;                
                if($scope.tmp.nameListId!=""){
                    var _catchFlag=false;
                    for(var i=0;i<$scope.nameList.length;i++){
                        if($scope.tmp.nameListId==$scope.nameList[i].id){
                            _catchFlag=true;
                            break;
                        }
                    }
                    if(!_catchFlag){
                        $scope.tmp.nameListId = "";
                    }
                }
            });
        }
        NameListInstance.getNameList=$scope.getNameList;
        //获取数据值
        $scope.selectDataValues = function () {
            if($scope.tmp.nameListId){
                apiNameList.getDataValues({
                        nameListId : $scope.tmp.nameListId, 
                        value : $scope.tmp.value,
                        page : $scope.currentPage||1,
                        per_page : $scope.per_page},function(data){
                    $scope.pageTotal = data.count;
                    $scope.dataValuesList = data.dataValueDTOs;
                });
            }
        }
        NameListInstance.selectDataValues=$scope.selectDataValues;
        $scope.pageChanged = function() {
            $scope.selectDataValues();
        };
        //接受过滤条件
        $scope.filterDataValues = function () {
            $scope.selValue=$scope.tmp.value;
            $scope.selectDataValues();
        }
        //载入页面时：
        $scope.init = function () {
            //获取名单列表
            $scope.getNameList();
            $scope.selectDataValues();
        };
        $scope.init();
        //选择名单列表
        $scope.chooseNameList = function (ent) {
            $scope.tmp.nameListId=ent.id;
            $scope.selectDataValues();
        }
        //添加名单列表
        $scope.addNameList = function(){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'AddNameList.html',
                controller: 'AddNameListController',
                resolve: {
                    serviceCode: function () {
                        return {type:'new'};
                    }
                }
            });
        }
        //修改名单列表
        $scope.editNameList = function(ent){
            $scope._tmpNameListEnt = ent;
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'AddNameList.html',
                controller: 'AddNameListController',
                resolve: {
                    serviceCode: function () {
                        return {type:'edit',id:$scope._tmpNameListEnt.id};
                    }
                }
            });
        }
        //删除名单列表
        $scope.deleteNameList = function(ent){
            $scope._tmpNameListEnt=ent;
            apiNameList.getListCandelete({nameListId:ent.id}, function (data) {
                if(data.status=="0"){
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'DeleteNameList.html',
                        controller: 'DeleteNameListController',
                        resolve: {
                            serviceCode: function () {
                                return $scope._tmpNameListEnt;
                            }
                        }
                    });
                }else{
                    $uibModal.open({
                        animation: true,
                        backdrop: 'static',
                        templateUrl: 'MessageModal.html',
                        controller: 'MessageModalController',
                        resolve: {
                            serviceCode: function () {
                                return {
                                    message:"该名单下还存在数据值或已应用在规则中，无法删除"
                                };
                            }
                        }
                    });
                }
            });
        }
        //新建数据值
        $scope.addDataValue = function () {          
            $state.go("editNameLists",{type:"new",nameListId:$scope.tmp.nameListId});
        };
        
        //编辑数据值
        $scope.editDataValue = function (ent) {
            $state.go("editNameLists",{type:"edit",nameListId:$scope.tmp.nameListId,dataValueId:ent.id});               
        };

        //删除数据值
        $scope.deleteDataValue = function (ent) {
            $scope._tmpNameListEnt=ent;
            $scope._tmpNameListEnt.nameListId=$scope.tmp.nameListId;            
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'DeleteDataValue.html',
                controller: 'DeleteDataValueController',
                resolve: {
                    serviceCode: function () {
                        return $scope._tmpNameListEnt;
                    }
                }
            });
                
            
        };
        
        
        //状态开关
        $scope.changeStatus = function (ent) {
            if($scope.saveFlag){return;}
            $scope.saveFlag=true;
            if(ent.status == '1' ){
                ent.status = '0';
            }else {
                ent.status = '1';
            }
            apiNameList.putDataValueStatus({nameListId :$scope.tmp.nameListId,dataValueId:ent.id,status:ent.status},function(){
                $scope.saveFlag=false;
            },function(){
                $scope.saveFlag=false;
            })
        }
    })

    .controller('AddNameListController', function ($scope, $uibModal, $uibModalInstance, serviceCode, apiNameList, NameListInstance) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.type = serviceCode.type;
        $scope.name = "";
        if($scope.type=="new"){
            $scope.title="添加名单"
        }else if($scope.type=="edit"){
            $scope.title="修改名单"
            $scope.nameListId=serviceCode.id;
        }else{
            $uibModalInstance.dismiss();
            return;
        }
        if($scope.type=="edit"){
            apiNameList.getId({nameListId:$scope.nameListId}, function (data) {
                $scope.name = data.name;
                $scope.oldName = $scope.name;
            });
        }
        $scope.ok = function () {
            if($scope.validate_name()){                                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="new"){
                    apiNameList.post({name:$scope.name}, function (result) {
                        NameListInstance.getNameList();
                        $uibModalInstance.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    apiNameList.putId({nameListId:$scope.nameListId,name:$scope.name}, function (result) {
                        NameListInstance.getNameList();
                        $uibModalInstance.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
            }
        };
        //验证显示名称
        $scope.tip_name = {invalid: false, info: ''};
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");
            var getBLen = function(str) {
                if (str == null) return 0;
                if (typeof str != "string"){str += "";}
                return str.replace(/[^x00-xff]/g,"01").length;
            }
            if ($scope.name === '') {
                $scope.tip_name = {invalid: true, info: '名称不能为空'};
            } else if (!namePattern.test($scope.name)) {
                $scope.tip_name = {invalid: true, info: '名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            } else if (getBLen($scope.name) < 2 || getBLen($scope.name) > 20) {
                $scope.tip_name = {invalid: true, info: '名称字符长度为2-20'};
            }else {
                if($scope.type=="edit"&&$scope.oldName==$scope.name){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiNameList.getNameUsed({name:$scope.name}, function (data) {
                        if (data.status==0) {
                            $scope.tip_name = {invalid: false, info: ''};
                        } else {
                            $scope.tip_name = {invalid: true, info: '名称不能重复'};
                        }
                    });
                }
            }
            
            return !$scope.tip_name.invalid;
        };
    })
    .controller('DeleteNameListController', function ($scope, $uibModal, $uibModalInstance, serviceCode, apiNameList, NameListInstance) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.id=serviceCode.id;
        $scope.name=serviceCode.name;
        $scope.ok = function () {
            
            apiNameList.deleteId({nameListId:$scope.id}, function (result) {
                NameListInstance.getNameList();
                $uibModalInstance.close();
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'MessageModal.html',
                    controller: 'MessageModalController',
                    resolve: {
                        serviceCode: function () {
                            return {
                                message:"删除成功"
                            };
                        }
                    }
                });
            });
  
            
        };
    })
    .controller('DeleteDataValueController', function ($scope, $uibModal, $uibModalInstance, serviceCode, apiNameList, NameListInstance) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
        $scope.id=serviceCode.id;
        $scope.nameListId=serviceCode.nameListId
        $scope.name=serviceCode.value;
        $scope.ok = function () {            
            apiNameList.deleteDataValueId({nameListId:$scope.nameListId,dataValueId:$scope.id}, function (result) {
                NameListInstance.selectDataValues();
                $uibModalInstance.close();
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'MessageModal.html',
                    controller: 'MessageModalController',
                    resolve: {
                        serviceCode: function () {
                            return {
                                message:"删除成功"
                            };
                        }
                    }
                });
            });
  
            
        };
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

    .factory('NameListInstance', function(){

        return {
            getNameList:angular.noop,
            selectDataValues:angular.noop
        };

    });