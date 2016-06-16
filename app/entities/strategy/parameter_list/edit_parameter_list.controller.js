'use strict';

angular.module('cloudxWebApp')
    .controller('EditParameterListController', function ($scope,$state,$stateParams,$timeout,$rightSlideDialog,apiParameter,apiSolution, ParameterInstance) {
        $scope.type  = $stateParams.type;
        if(!$scope.type){
            $state.go("parameterList");
            return;
        } else if($scope.type=="new"){
            $scope.title = "添加自定义字段";
        } else if($scope.type=="edit"){
            $scope.title = "编辑自定义字段";
        }
        $scope.editOldName = "";
        $scope.dataTmp={};       
        
        $scope.close = function(){
            $rightSlideDialog.close('edit_parameter_list');
        }
        $scope.save = function(){
            if ($scope.validate()) {
                $scope.sessionData.parameterTagId = $scope.dataTmp.dimensionEnt.id;
                $scope.sessionData.parameterTagCode = $scope.dataTmp.dimensionEnt.code;
                $scope.sessionData.parameterTagName = $scope.dataTmp.dimensionEnt.name;
                $scope.sessionData.valueTypeId = $scope.dataTmp.typeEnt.id;
                $scope.sessionData.valueTypeName = $scope.dataTmp.typeEnt.name;
                $scope.sessionData.maxLength = $scope.sessionData.maxLength||1024;                
                if($scope.saveFlag){return;}
                $scope.saveFlag=true;
                if($scope.type=="new"){
                    $scope.sessionData.id="";
                    apiParameter.post($scope.sessionData,function(result){
                        ParameterInstance.selectParameters();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }else{
                    $scope.sessionData.parameterId=$scope.sessionData.id;
                    apiParameter.putId($scope.sessionData,function(result){
                        ParameterInstance.selectParameters();
                        $scope.close();
                        $scope.saveFlag=false;
                    },function(){
                        $scope.saveFlag=false;
                    });
                }
            }
            
        }
        //改变是否启用
        $scope.changeIsAnalyze = function(value){
            $scope.sessionData.isAnalyze=value;
        }
          //改变是否风险阈值
        $scope.changeStatus = function(value){
            $scope.sessionData.status=value;
        }
        $scope.sessionData={
            "id": $stateParams.detail?$stateParams.detail.id:"",
            "code": $stateParams.detail?$stateParams.detail.code.slice(4):"",
            "name": $stateParams.detail?$stateParams.detail.name:"",
            "parameterTagId":$stateParams.detail?$stateParams.detail.parameterTagId:"",
            "parameterTagCode":$stateParams.detail?$stateParams.detail.parameterTagCode:"",
            "parameterTagName": $stateParams.detail?$stateParams.detail.parameterTagName:"",
            "valueTypeId": $stateParams.detail?$stateParams.detail.valueTypeId:"",
            "valueTypeName":$stateParams.detail?$stateParams.detail.valueTypeName:"",
            "maxLength": $stateParams.detail?$stateParams.detail.maxLength:"",
            "type":$stateParams.detail?$stateParams.detail.type:"",
            "description": $stateParams.detail?$stateParams.detail.description:"",
            "status": $stateParams.detail?$stateParams.detail.status:0,
            "isAnalyze":$stateParams.detail?$stateParams.detail.isAnalyze:0
        };
        $scope.oldCode=$scope.sessionData.code;
        $scope.oldName=$scope.sessionData.name;
        //初始获取参数
        $scope.init = function () {
            //字段维度
            apiParameter.getTags({},function(data){
                $scope.dataTmp.dimensionList = data;
                if($scope.sessionData.parameterTagId){
                    for(var i=$scope.dataTmp.dimensionList.length;i--;){
                        if($scope.sessionData.parameterTagId==$scope.dataTmp.dimensionList[i].id){
                            $scope.dataTmp.dimensionEnt = $scope.dataTmp.dimensionList[i];
                            break;
                        }
                    }
                    if($scope.dataTmp.dimensionEnt.needLocation == 1){
                        $scope.isAnalyzeShow = 1;
                    }else{
                        $scope.isAnalyzeShow = 0;
                    }
                }
            });
            
            //字段类型
            apiParameter.getValueTypes({},function (data) {
                $scope.dataTmp.typeList = data;
                if($scope.sessionData.valueTypeId){
                    for(var i=$scope.dataTmp.typeList.length;i--;){
                        if($scope.sessionData.valueTypeId==$scope.dataTmp.typeList[i].id){
                            $scope.dataTmp.typeEnt = $scope.dataTmp.typeList[i];
                            break;
                        }
                    }

                }
            });            
        };
        $scope.init();
        
        //验证字段名称
        $scope.tip_code = {invalid: false, info: ''};
        $scope.validate_code = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var namePattern = new RegExp("^[0-9a-zA-Z_]+$"); 
            var getBLen = function(str) {
                if (str == null) return 0;
                if (typeof str != "string"){str += "";}
                return str.replace(/[^x00-xff]/g,"01").length;
            }
            if ($scope.sessionData.code === '') {
                $scope.tip_code = {invalid: true, info: '字段名称不能为空'};
            }
            else if (!namePattern.test($scope.sessionData.code)) {
                $scope.tip_code = {invalid: true, info: '字段名称仅可包含英文字母、数字和下划线，请重新输入'};
            } else if (getBLen($scope.sessionData.code) < 2 || getBLen($scope.sessionData.code) > 46) {
                $scope.tip_code = {invalid: true, info: '字段名称字符长度为6-50'};
            }else {
                if($scope.type=="edit"&&$scope.oldCode==$scope.sessionData.code){
                    $scope.tip_code = {invalid: false, info: ''};
                }else{
                    apiParameter.getNameUsed({keytype:0,keyword:$scope.sessionData.code}, function (data) {
                        if (data.status==0) {
                            $scope.tip_code = {invalid: false, info: ''};
                        } else {
                            $scope.tip_code = {invalid: true, info: '字段名称不能重复'};
                        }
                    });
                }
            }
            
            return !$scope.tip_code.invalid;
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
            if ($scope.sessionData.name === '') {
                $scope.tip_name = {invalid: true, info: '显示名称不能为空'};
            } else if (!namePattern.test($scope.sessionData.name)) {
                $scope.tip_name = {invalid: true, info: '显示名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            } else if (getBLen($scope.sessionData.name) < 2 || getBLen($scope.sessionData.name) > 16) {
                $scope.tip_name = {invalid: true, info: '显示名称字符长度为2-16'};
            }else {
                if($scope.type=="edit"&&$scope.oldName==$scope.sessionData.name){
                    $scope.tip_name = {invalid: false, info: ''};
                }else{
                    apiParameter.getNameUsed({keytype:1,keyword:$scope.sessionData.name}, function (data) {
                        if (data.status==0) {
                            $scope.tip_name = {invalid: false, info: ''};
                        } else {
                            $scope.tip_name = {invalid: true, info: '显示名称不能重复'};
                        }
                    });
                }
            }
            
            return !$scope.tip_name.invalid;
        };
        //验证维度
        $scope.validate_dimension = function () {
            
            $scope.tip_all = {invalid: false, info: ''};
            if (!$scope.dataTmp.dimensionEnt) {
                $scope.tip_dimension = {invalid: true, info: '请选择维度'};
            } else {
                $scope.tip_dimension = {invalid: false, info: ''};
                if($scope.dataTmp.dimensionEnt.needLocation == 1){
                    $scope.isAnalyzeShow = 1;
                }else{
                    $scope.isAnalyzeShow = 0;
                }
            }
            return !$scope.tip_dimension.invalid;
        };
        //验证类型
        $scope.validate_type = function () {
            $scope.tip_all = {invalid: false, info: ''};

            if (!$scope.dataTmp.typeEnt) {
                $scope.tip_type = {invalid: true, info: '请选择类型'};
            } else {
                $scope.tip_type = {invalid: false, info: ''};
            }
            return !$scope.tip_type.invalid;
        };
        //验证最大长度
        $scope.validate_maxLength = function () {
            $scope.tip_all = {invalid: false, info: ''};
            function isPInt(str) {
                var g = /^[1-9]*[1-9][0-9]*$/;
                return g.test(str);
            }
            if($scope.sessionData.maxLength==""){
                $scope.tip_maxLength = {invalid: false, info: '默认最大长度为1024'};
            } else if (!$scope.sessionData.maxLength) {
                $scope.tip_maxLength = {invalid: true, info: '请输入最大长度'};
            } else if (!isPInt($scope.sessionData.maxLength)) {
                $scope.tip_maxLength = {invalid: true, info: '最大长度必须是正整数'};
            } else {
                if ($scope.sessionData.maxLength > 1024) {
                    $scope.tip_maxLength = {invalid: true, info: '最大长度1024'};
                }else{
                    $scope.tip_maxLength = {invalid: false, info: ''};
                }
            }
            
            return !$scope.tip_maxLength.invalid;
        };
        //验证说明
        $scope.validate_description = function () {
            $scope.tip_all = {invalid: false, info: ''};
            var namePattern = new RegExp("[~`!@#$%^&*()-+={}\\[\\]|\\:;\"\'<>,./?～｀！@＃$％……&＊（）—－＋＝｛｝［］｜、；：“‘《》，。？／]");
            if (namePattern.test($scope.sessionData.name)) {
                $scope.tip_description = {invalid: true, info: '说明仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            }
            else {
                $scope.tip_description = {invalid: false, info: ''};
            }
            return !$scope.tip_description.invalid;
        };
        //提交验证
        $scope.validate = function () {
            var isRight = $scope.validate_code() & $scope.validate_name() & $scope.validate_dimension() 
                    & $scope.validate_type() & $scope.validate_maxLength() & $scope.validate_description();
            if( isRight ) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请按错误提示修改内容'};
            return false;
        };
        
    });
