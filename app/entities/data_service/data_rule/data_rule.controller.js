'use strict';

angular.module('cloudxWebApp')
    .controller('DataRuleController', function ($scope, dataRule, $uibModal, serviceApplication, serviceGroup) {

        //init choice
        $scope.serviceType = [
            {
                'id': '-1',
                'name': '全部'
            }
        ];

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
            }/*,
            {
                'code': '1',
                'name': '申请中'
            },
            {
                'code': '2',
                'name': '已停用'
            },
            {
                'code': '3',
                'name': '维护中'
            }*/
        ];


        $scope.isPay = ['免费', '收费'];
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

        // search
        $scope.searchDataRule = function () {
            $scope.dataServiceList = [];

            if ($scope.selectService.id == '-1') {
                for (var i = 0; i < $scope.dataRuleList.length; i++) {
                    $scope.dataServiceList = angular.copy($scope.dataRuleList);
                }
            }
            else {
                for (var j = 0; j < $scope.dataRuleList.length; j++) {
                    if ($scope.dataRuleList[j].dataServiceGroupName == $scope.selectService.name) {
                        $scope.dataServiceList = angular.copy($scope.dataRuleList.slice(j, j + 1));
                    }
                }
            }

            if ($scope.selectAuthorization.code != '-2') {
                for (var i = 0; i < $scope.dataServiceList.length; i++) {
                    for (var j = 0; j < $scope.dataServiceList[i].dataServiceDTOs.length; j++) {
                        if ($scope.dataServiceList[i].dataServiceDTOs[j].authorization != $scope.selectAuthorization.code) {
                            $scope.dataServiceList[i].dataServiceDTOs.splice(j, 1);
                            j = j - 1;
                        }
                    }
                }
            }

            for (var i = 0; i < $scope.dataServiceList.length; i++) {
                if ($scope.dataServiceList[i].dataServiceDTOs.length == 0) {
                    $scope.dataServiceList.splice(i, 1);
                    i = i - 1;
                }
            }
        };

        $scope.init = function () {
            $scope.serviceType = [{'id': '-1', 'name': '全部'}];

            dataRule.get({}, function (result) {
                $scope.dataRuleList = result;
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
    })

    .controller('ApplyAuthorizationController', function ($scope, dataRule, $uibModalInstance, serviceApplication, serviceCode) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.ok = function () {
            serviceApplication.post({dataServiceCode: serviceCode}, {})
                .$promise.then(function (result) {
                    //console.log(result);
                },
                function (err) {
                    //console.log(err);
                });
            $uibModalInstance.close();
        };
    })

;