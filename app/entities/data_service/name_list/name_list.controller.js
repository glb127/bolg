'use strict';

angular.module('cloudxWebApp')
    .controller('NameListController',function ($scope, NameListManager, ParseLinks,$uibModal) {
        $scope.blackListManagers = [];
        $scope.page = 1;
        //维度选项数组
        //$scope.dimensions=[{"text":"IP","value":"IP"},{"text":"手机号","value":"mobile"},{"text":"身份证号","value":"IDNumber"},{"text":"银行卡号","value":"banks"},{"text":"护照号","value":"PassPortNumber"},{"text":"账户ID","value":"AccountID"},{"text":"IMEI号","value":"IMEINumber"},{"text":"设备号","value":"DeviceNumber"}];
        $scope.dimensions=["IP","手机号","身份证号","银行卡号","护照号","账户ID","IMEI号","设备号"];
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.statusList = [
            {
                "name": "全部",   //显示在html中
                "code": ""        //做为查询条件传入后台
            },
            {
                "name": "已生效",
                "code": "1"
            },
            {
                "name": "已失效",
                "code": "2"
            }
        ];

        $scope.typeList=[
            {
                "name": "黑名单",
                "code":"0"
            },
            {
                "name": "灰名单",
                "code":"1"
            },
            {
                "name": "白名单",
                "code":"2"
            }];


        $scope.blackListManagerForm = {
            "pageSize": 20,
            "pageNumber": $scope.page,
            "status": "",
            "type": ""
        };

        //显示新建的名单类型
        $scope.changeTypeList=function(type){
            for(var j=0;j<$scope.typeList.length;j++){
                if(type==null){
                    $scope.showType="";
                }
                else if(type==$scope.typeList[j].code) {
                    $scope.showType=$scope.typeList[j].name;
                }
            }
            $scope.queryByCondition();
        }
        //转化名单类型、名单状态
        $scope.translateTypeListAndStatus =function(result){
            for(var i=0;i<result.length;i++){
                //转化永久有效期
                if(result[i].validity=='-1'){
                    result[i].invalidTime='永久';
                }
                //转化名单类型
                for(var j=0;j<$scope.typeList.length;j++){
                    if(result[i].type==$scope.typeList[j].code) {
                        result[i].type=$scope.typeList[j].name;
                    }
                }
                //转化名单状态
                for(var j=0;j<$scope.statusList.length;j++){
                    if(result[i].status==$scope.statusList[j].code){
                        result[i].status=$scope.statusList[j].name;
                    }
                }
                $scope.blackListManagers.push(result[i]);
            }
        };

        $scope.translateValidity = function(result){
            if(result.validity=="-1"){
                result.validity="永久";
            }
            if(result.validity=="30"){
                result.validity="30";
            }
            if(result.validity=="60"){
                result.validity="60";
            }
            if(result.validity=="180"){
                result.validity="180";
            }
            if(result.validity=="360"){
                result.validity="360";
            }
        }

        $scope.loadAll = function() {
            NameListManager.query($scope.blackListManagerForm, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                //数据为空的分页判断（待定）
                if($scope.links['last']==0){
                    $scope.page=0;
                }
                $scope.translateTypeListAndStatus(result);
            });
        };

        $scope.setStatus = function (index) {
            $scope.blackListManagerForm.status = $scope.statusList[index].code;
            $scope.queryByCondition();
        };

        //根据条件查询
        $scope.queryByCondition=function(){
            $scope.reset();
            NameListManager.query($scope.blackListManagerForm,function(result,headers){
                $scope.links = ParseLinks.parse(headers('link'))
                $scope.translateTypeListAndStatus(result);
            });
        };

        //新建名单打开窗口
        $scope.openNameListManager = function () {
            var modalInstance = $uibModal.open({
                backdrop: "static",
                templateUrl: 'app/entities/data_service/name_list/name_list.add.html',
                controller: 'SaveNameListController',
                resolve: {
                    nameListType: function(){
                        return $scope.showType;
                    },
                    nameListTypeValue:function(){
                        return $scope.blackListManagerForm.type
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.blackListManagers.length=0;
                $scope.reset();
            });
        };

        //修改名单触发方法
        $scope.updateBlackListManager=function(id){
            NameListManager.get({id:id},function(result){
                $scope.translateValidity(result);
                var modalInstance = $uibModal.open({
                    backdrop: "static",
                    templateUrl: 'app/entities/data_service/name_list/name_list.update.html',
                    controller: 'UpdateNameListController',
                    resolve: {
                        blackList: function () {
                            return result;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    $scope.blackListManagers.length=0;
                    $scope.reset();
                });
            });
        };
        $scope.reset = function() {
            $scope.blackListManagerForm.pageNumber=1;
            $scope.page = 1;
            $scope.blackListManagers = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.blackListManagerForm.pageNumber = page;
            $scope.page=page;
            $scope.loadAll();
        };
        $scope.loadAll();
    })
    //新建名单控制器
    .controller('SaveNameListController', function ($scope, $uibModalInstance, NameListManager, nameListType,nameListTypeValue) {
        //$scope.dimensions=["IP","手机号","身份证号","银行卡号","护照号","账户ID","IMEI号","设备号"];
        $scope.types=[
            {
                "name": "黑名单",
                "code":"0"
            },
            {
                "name": "灰名单",
                "code":"1"
            },
            {
                "name": "白名单",
                "code":"2"
            }];

        $scope.dimensions=[
            {
                "name":"IP",
                "code":"IP"
            },
            {
                "name":"手机号",
                "code":"mobile"
            },
            {
                "name":"身份证号",
                "code":"IDNumber"
            },
            {
                "name":"银行卡号",
                "code":"banks"
            },
            {
                "name":"护照号",
                "code":"PassPortNumber"
            },
            {
                "name":"账户ID",
                "code":"AccountID"
            },
            {
                "name":"IMEI号",
                "code":"IMEINumber"
            },{
                "name":"设备号",
                "code":"DeviceNumber"
            }];
        $scope.validities=['30天','60天','120天','180天','永久','自定义'];


        $scope.showType = !(nameListType);    //if nameListType is "", enable to choose type of namelist
        $scope.nameListType = nameListType;
        $scope.nameListTypeValue=nameListTypeValue;
        $scope.blackListManagerForm = {
            "dimensionCh": "",
            "dimension":"",
            "type": "",
            validity: "",
            value: "",
            "comment": "",
            "description": ""
        };
        $scope.init = function () {
            $scope.msg = "";
        };
        $scope.translateList = function(blackListManagerForm){
            for(var i=0;i<$scope.dimensions.length;i++){
                if($scope.dimensions[i].code==$scope.blackListManagerForm.dimension){
                    $scope.blackListManagerForm.dimension=$scope.dimensions[i].code;
                    $scope.blackListManagerForm.dimensionCh=$scope.dimensions[i].name;
                }
            }
        }
        $scope.saveNameList = function () {
            $scope.translateList($scope.blackListManagerForm);
            if(!$scope.showType) {
                $scope.blackListManagerForm.type = nameListTypeValue;
            }
            if($scope.blackListManagerForm.dimension == "mobile"){
                if($scope.blackListManagerForm.value.length != 11){
                    $scope.msg="手机号长度不正确";
                    return;
                }
            }
            if($scope.blackListManagerForm.dimension == "IDNumber"){
                if(!($scope.blackListManagerForm.value.length ==15 || $scope.blackListManagerForm.value.length == 18)){
                    $scope.msg="身份证号长度不正确";
                    return;
                }
            }
            if($scope.blackListManagerForm.dimension == "banks"){
                if($scope.blackListManagerForm.value.length <13){
                    $scope.msg="银行卡号长度不正确";
                    return;
                }
            }
            //传到后台的validity格式为“30天”格式
            if($scope.blackListManagerForm.validity=='自定义'){
                $scope.blackListManagerForm.validity=$scope.validityDefined+"天";
            }
            NameListManager.save($scope.blackListManagerForm,function(result,headers){
                $uibModalInstance.close();
            });
        };

        $scope.cancelNameList = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })
    //修改名单控制器
    .controller('UpdateNameListController', function ($scope, $uibModalInstance,blackList,NameListManagerUpdate) {
        $scope.dimensions=["IP","手机号","身份证号","银行卡号","护照号","账户ID","IMEI号","设备号"];
        $scope.blackList = blackList;
        $scope.validities=['30','60','120','180','永久','自定义'];
        $scope.removeDuplicateValidities=[];
         $scope.typeList=[
            {
                "name": "黑名单",
                "code":"0"
            },
            {
                "name": "灰名单",
                "code":"1"
            },
            {
                "name": "白名单",
                "code":"2"
            }];

            //去重
          $scope.removeDuplicate = function(val){
            for(var j=1;j<val.length;j++){
                var key=val[0];
                if(key==val[j]){
                    val.splice(j,1);
                }
            }
            return val;
        }
        $scope.removeDuplicateFromValidities = function(){
            if($scope.blackList.validity!=undefined){
                var j=0;
                for(var i=0;i<$scope.validities.length;i++){
                    //构建一个新的包含原始数据以及默认数据的数组并删除重复项
                    $scope.removeDuplicateValidities[++j]=$scope.validities[i];
                    $scope.removeDuplicateValidities[0]=$scope.blackList.validity;
                }
                $scope.removeDuplicate($scope.removeDuplicateValidities);
            }
            else{
                $scope.removeDuplicateValidities=$scope.validities;
            }
        }
        $scope.removeDuplicateFromValidities();

        //转化名单类型显示
        $scope.changeTypeList=function(){
            $scope.showType="";
            for(var j=0;j<$scope.typeList.length;j++){
                if($scope.blackList.type==$scope.typeList[j].code) {
                    $scope.showType=$scope.typeList[j].name;
                }
            }

        }
        $scope.changeTypeList();
        $scope.updateNameList = function () {
            if($scope.blackList.validity=="永久"){
                $scope.blackList.validity="-1";
            }
            if($scope.blackList.validity=='自定义'){
                $scope.blackList.validity=$scope.validityDefined;
            }
            NameListManagerUpdate.update($scope.blackList,function(result,headers){
                $uibModalInstance.close();
            });
        };

        $scope.cancelNameList = function () {
            $uibModalInstance.dismiss('cancel');
        };
    });
