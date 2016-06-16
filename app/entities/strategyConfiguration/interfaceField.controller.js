'use strict';

angular.module('cloudxWebApp')
    .controller('InterfaceFieldController', function ($q, $scope, $state, $compile, $uibModal, ParseLinks, $stateParams, interfaceField) {
        $scope.strategyInstanceId = $stateParams.id;

        $scope.init = function(){
            interfaceField.get({strategyInstanceID: $scope.strategyInstanceId},{}, function(result){
                $scope.interfaceFieldList = result;
                console.log($scope.interfaceFieldList);
            });
        };
        $scope.init();

    });
