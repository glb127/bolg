'use strict';

angular.module('cloudxWebApp')
    .controller('StrategyViewController', function ($q, $scope, $state, $compile, $uibModal, ParseLinks, $stateParams,
                                                    strategyVisualization, dataServiceOfSolution) {

        $scope.tabtn = 'Right';
        $scope.strategyInstanceId = $stateParams.id;
        $scope.riskLevelMap = {
            4: '极高风险',
            3: '高风险',
            2: '中风险',
            1: '低风险',
            0: '极低风险'
        };

        $scope.isPay = {
            0: '免费',
            1: '收费'
        };

        $scope.isSynchronization = {
            0: '实时',
            1: '非实时',
            2: '准实时'
        };

        $scope.authorization = {
            '-1': '未开通',
            '0': '已开通',
            '1': '申请中',
            '2': '默认开通'
        };

        $scope.decisionPolicy = {
            '1': '最坏匹配'
        };

        $scope.init = function () {
            strategyVisualization.get({strategyInstanceId: $scope.strategyInstanceId}, function (result) {
                $scope.strategyInstance = result;
                $scope.scenarioInstanceList = $scope.strategyInstance.scenarioVisualizationInstanceDTOs;
                console.log('$scope.strategyInstance');
                console.log($scope.scenarioInstanceList);

                $scope.dataServiceList = [];
                for(var i=0; i<$scope.scenarioInstanceList.length; i++){
                    var dataServiceListOfScenario = [];
                    for(var j=0; j<$scope.scenarioInstanceList[i].solutionVisualizationInstanceDTOs.length; j++){
                        var item = dataServiceOfSolution.get({solutionInstanceId: $scope.scenarioInstanceList[i].solutionVisualizationInstanceDTOs[j].id}, function(){});
                        dataServiceListOfScenario.push(item);
                    }
                    $scope.dataServiceList.push(dataServiceListOfScenario);
                }
            });

            angular.element('.disabled').removeAttr('popover-template-arrow');
        };



        $scope.dynamicPopover = {
            //content: "",
            templateUrl: 'dataServiceList.html'
        };

        $scope.init();

        $scope.showDataService = function (a, b) {
            $scope.dataService = $scope.dataServiceList[a][b];
        };

        $scope.showWordList = function (solution) {
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'wordList.html',
                    controller: 'wordListController',
                    resolve: {
                        strategyInstanceId: function () {
                            return $scope.strategyInstanceId;
                        }
                    }
                });

        };

        $scope.strategyConfiguration = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'app/entities/strategyConfiguration/edit.html',
                controller: 'StrategyConfigurationEditController',
                size: 'lg',
                resolve: {
                    id: function () {
                        return $scope.strategyInstanceId;
                    },
                    strategyConfiguration: function () {
                        return $scope.strategyInstance;
                    }
                }
            });

            modalInstance.result.then(function (strategyInstance) {
                $state.reload();
                //$scope.strategyInstance = strategyInstance;
                //$scope.strategyInstance.riskLevelVisualizationDefinitions = $scope.strategyInstance.riskLevelDefinitions;
            }, function () {

            });
        };
    })

    .controller('dataServiceController', function($scope, $uibModalInstance, $state, solution, dataServiceOfSolution){

        $scope.solutionId = solution.solutionId;
        $scope.solutionName = solution.solutionName;

        $scope.isPay = {
            0: '免费',
            1: '收费'
        };

        $scope.isSynchronization = {
            0: '实时',
            1: '非实时',
            2: '准实时'
        };

        $scope.authorization = {
            '-1': '未开通',
            '0': '已开通',
            '1': '申请中',
            '2': '默认开通'
        };

        $scope.init = function(){
            dataServiceOfSolution.get({solutionInstanceId: $scope.solutionId}, function(result){
                $scope.dataServiceList = result;
            });
        };
        $scope.init();

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    })

    .controller('wordListController', function($scope, $uibModalInstance, interfaceField, strategyInstanceId){
        $scope.init = function(){
            $scope.strategyInstanceId = strategyInstanceId;
            interfaceField.get({},{}, function(result){
                $scope.interfaceField = result.interfaceFieldDTOs;
            });
        };

        $scope.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };
    })
;


