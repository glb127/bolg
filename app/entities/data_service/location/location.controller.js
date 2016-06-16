'use strict';

angular.module('cloudxWebApp')
    .controller('LocationController', function ($scope, LocalQuery) {
        $scope.localQuery = [];

        $scope.init = function () {
            $scope.flag = false;
            $scope.msgs = "";
            $scope.location = undefined;
        };
        $scope.init();


        $scope.getDimension = function (dimension, dValue) {
            if (!dValue) {
                $scope.msgs = "请输入维度值！";
                return;
            }
            LocalQuery.query({dimension: dimension, dValue: dValue}, function (result) {
                $scope.flag = true;
                $scope.location = result;
            });

        };
    });
