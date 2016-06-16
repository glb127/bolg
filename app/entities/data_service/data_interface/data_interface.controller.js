'use strict';

angular.module('cloudxWebApp')
    .controller('DataInterfaceController', function ($scope, dataApi, $uibModal, serviceGroup, serviceApplication, serviceInterface) {

        //init choice
        $scope.serviceType = [{'id': '-1', 'name': '全部'}];

        // 条件搜索用：条件搜索中的“开通情况”
        $scope.authorization = [
            {
                'code': '-2',
                'name': '全部'
            },
            {
                'code': '-1',
                'name': '未开通'
            },
            {
                'code': '0',
                'name': '已开通'
            }
        ];

        //initial the value
        $scope.isPay = ['免费', '收费'];
        $scope.status = ['启用', '停用'];
        $scope.isSynchronization = ['实时', '非实时', '准实时'];

        // 搜索结果中的“开通情况”字段
        $scope.myauthorization = {
            '-1': '申请开通',
            '0': '已开通',
            '1': '申请中',
            '2': '已停用'
        };

        // 数据规则status字段：1，‘开通情况’为‘维护中’；0，根据authorization的值判断

        // get init data
        $scope.selectService = {id: '-1'};
        $scope.selectAuthorization = {code: '-2'};

        //search
        $scope.searchDataRule = function () {
            $scope.apiServiceList = [];

            if ($scope.selectService.id == '-1') {
                for (var i = 0; i < $scope.dataApiList.length; i++) {
                    $scope.apiServiceList = angular.copy($scope.dataApiList);
                }
            } else {
                for (var i = 0; i < $scope.dataApiList.length; i++) {
                    if ($scope.dataApiList[i].apiServiceGroupName == $scope.selectService.name) {
                        $scope.apiServiceList = angular.copy($scope.dataApiList.slice(i, i + 1));
                    }
                }
            }

            if ($scope.selectAuthorization.code != '-2') {
                for (var i = 0; i < $scope.apiServiceList.length; i++) {
                    for (var j = 0; j < $scope.apiServiceList[i].apiServiceDTOs.length; j++) {
                        if ($scope.apiServiceList[i].apiServiceDTOs[j].authorization != $scope.selectAuthorization.code) {
                            $scope.apiServiceList[i].apiServiceDTOs.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }

            for (var i = 0; i < $scope.apiServiceList.length; i++) {
                if ($scope.apiServiceList[i].apiServiceDTOs.length == 0) {
                    $scope.apiServiceList.splice(i, 1);
                    i = i - 1;
                }
            }
        };

        $scope.init = function () {
            $scope.serviceType = [{'id': '-1', 'name': '全部'}];

            dataApi.get({}, function (result) {
                $scope.dataApiList = result;
                $scope.searchDataRule();
            });
            serviceGroup.get({}, function (result) {
                $scope.serviceGroup = result.dataServiceGroups;
                for (var i = 0; i < $scope.serviceGroup.length; i++) {
                    $scope.serviceType.push($scope.serviceGroup[i]);
                }
            });
        };
        $scope.init();

        //set serviceType
        $scope.setServiceType = function (index) {
            $scope.selectService = $scope.serviceType[index];
            $scope.searchDataRule();
        };

        //set authorization
        $scope.setAuthorization = function (index) {
            $scope.selectAuthorization = $scope.authorization[index];
            $scope.searchDataRule();
        };

        //apply authorization
        $scope.applyAuthorization = function (code) {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'applyAuthorization.html',
                controller: 'ApplyAuthorizationController',
                resolve: {
                    serviceCode: function () {
                        return code;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                $scope.init();
            });
        };

        $scope.openDownloadBill = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/entities/data_service/data_rule/bill_download.html',
                controller: 'BillDownloadController'
            });
        };

        $scope.downloadInterface = function (code) {

            serviceInterface.get({'code': code}).then(
                function (response) {
                    // 模拟 click link
                    var aLink = document.createElement('a');
                    var evt = document.createEvent('HTMLEvents');
                    evt.initEvent('click', false, false);
                    aLink.download = response.data.path;
                    aLink.href = response.data.path;
                    aLink.dispatchEvent(evt);
                });


        }
    })
;
