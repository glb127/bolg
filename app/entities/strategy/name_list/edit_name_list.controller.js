'use strict';

angular.module('cloudxWebApp')
    .controller('EditNameListsController', function ($scope,$state,$stateParams,$timeout,$rightSlideDialog,apiParameter,apiNameList, NameListInstance) {
        $scope.type  = $stateParams.type;
        $scope.nameListId  = $stateParams.nameListId;
        $scope.dataValueId  = $stateParams.dataValueId;
        if(!$scope.type){
            $state.go("nameLists");
            return;
        }
        $scope.editOldName = "";
        $scope.dataTmp={};
        
        if($scope.type=="new"){
            $scope.title = "添加数据值";
        }else if($scope.type=="edit"){
            $scope.title = "编辑数据值";
        } 
        $scope.close = function(){
            $rightSlideDialog.close('edit_name_lists');
        }
        $scope.save = function(){
            
            if ($scope.validate()) {
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="new"){
                    $scope.sessionData.nameListId=$scope.nameListId;
                    apiNameList.postDataValue($scope.sessionData,function(result){
                        NameListInstance.getNameList();
                        NameListInstance.selectDataValues();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    $scope.sessionData.nameListId=$scope.nameListId;
                    $scope.sessionData.id=$scope.dataValueId;
                    $scope.sessionData.dataValueId=$scope.dataValueId;
                    apiNameList.putDataValueId($scope.sessionData,function(result){
                        NameListInstance.getNameList();
                        NameListInstance.selectDataValues();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
            }
            
        }
        $scope.sessionData={
            "value": "",
            "parameterTagId": "",
            "description":"",
            "status":0
        };

        //初始获取参数
        $scope.init = function () {
            //字段维度
            apiParameter.getTags({},function(data){
                $scope.dataTmp.dimensionList = data;
                if($scope.type=="edit"){
                    apiNameList.getDataValueId({nameListId: $scope.nameListId, dataValueId: $scope.dataValueId},function(data){
                        $scope.sessionData=data;
                    });
                }
            });           
        };
        $scope.init();
        
        //验证字段名称
        $scope.validate_value = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_\u4E00-\u9FA5]+$");; 
            var getBLen = function(str) {
                if (str == null) return 0;
                if (typeof str != "string"){str += "";}
                return str.replace(/[^x00-xff]/g,"01").length;
            }
            if ($scope.sessionData.value === '') {
                $scope.tip_value = {invalid: true, info: '数据值不能为空'};
            } else {
                $scope.tip_value = {invalid: false, info: ''};
            }
            
            return !$scope.tip_value.invalid;
        };
        
        //验证维度
        $scope.validate_dimension = function () {
            
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.sessionData.parameterTagId) {
                $scope.tip_dimension = {invalid: true, info: '请选择维度'};
            } else {
                $scope.tip_dimension = {invalid: false, info: ''};
            }
            return !$scope.tip_dimension.invalid;
        };
        
        //验证描述
        $scope.validate_description = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var namePattern = new RegExp("[~`!@#$%^&*()-+={}\\[\\]|\\:;\"\'<>,./?～｀！@＃$％……&＊（）—－＋＝｛｝［］｜、；：“‘《》，。？／]");
            if (namePattern.test($scope.sessionData.description)) {
                $scope.tip_description = {invalid: true, info: '描述仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            }
            else {
                $scope.tip_description = {invalid: false, info: ''};
            }
            return !$scope.tip_description.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_value() & $scope.validate_dimension() & $scope.validate_description();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };
        
    });
