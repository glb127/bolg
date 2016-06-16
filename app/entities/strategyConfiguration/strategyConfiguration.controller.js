'use strict';

angular.module('cloudxWebApp')
    .controller('StrategyConfigurationController', function ($scope, StrategyConfiguration, ParseLinks, $uibModal) {
        $scope.strategyConfigurations = [];
        $scope.page = 1;
        $scope.loadAll = function() {
            /*StrategyConfiguration.query({page: $scope.page, per_page: 20}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.strategyConfigurations.push(result[i]);
                }
            });*/
        };
        $scope.reset = function() {
            $scope.page = 1;
            $scope.strategyConfigurations = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();

        $scope.onCreate = function() {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                templateUrl: 'app/entities/strategyCreate/strategyCreate-step1.html',
                controller: 'StrategyCreateStep1Controller'
                //controller: 'StrategyCreateController'
            });

            modalInstance.result.then(function () {
                $scope.reset();
            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });
        };
        
        

        //打开攻略配置弹框
        //待：移到攻略中心
        $scope.test = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: "static",
                templateUrl: 'app/entities/strategyConfiguration/strategyConfiguration-detail.html',
                controller: 'StrategyConfigurationDetailController'
            })
        };

        $scope.update = function (id) {
            StrategyConfiguration.get({id: id}, function(result) {
                $scope.strategyConfiguration = result;
                $('#saveStrategyConfigurationModal').modal('show');
            });
        };

        $scope.delete = function (id) {
            StrategyConfiguration.get({id: id}, function(result) {
                $scope.strategyConfiguration = result;
                $('#deleteStrategyConfigurationConfirmation').modal('show');
            });
        };

        $scope.confirmDelete = function (id) {
            StrategyConfiguration.delete({id: id},
                function () {
                    $scope.reset();
                    $('#deleteStrategyConfigurationConfirmation').modal('hide');
                    $scope.clear();
                });
        };

        $scope.clear = function () {
            $scope.strategyConfiguration = {test: null, id: null};
            $scope.editForm.$setPristine();
            $scope.editForm.$setUntouched();
        };
    });
