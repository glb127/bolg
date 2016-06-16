'use strict';

angular.module('cloudxWebApp')
    .controller('StrategyGuideController', function ($scope) {

        // , MerchantTypes, $uibModal
        // $scope.onCreate = function () {
        //     $scope.loadingPromise = MerchantTypes.get();
        //     $scope.loadingPromise.then(function (data) {
        //         $scope.sessionData = {};
        //         var merchantTypes = data;

        //         // set all merchant types unchecked
        //         for (var i = 0; i < merchantTypes.length; i++) {
        //             merchantTypes[i].check = false;
        //         }
        //         $scope.sessionData.merchantTypes = merchantTypes;
        //         $uibModal.open({
        //             animation: true,
        //             backdrop: "static",
        //             templateUrl: 'app/entities/strategy/new/new_step_1.html',
        //             controller: 'StrategyCreateStep1Controller',
        //             resolve: {
        //                 sessionData: function () {
        //                     return $scope.sessionData;
        //                 }
        //             }
        //         });
        //     });
        // };
    })


