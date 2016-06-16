'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('idNumberVerification', {
                parent: 'dataService',
                url: '/id_number_verification',
                data: {
                    roles: ['ROLE_USER']
                },
                views: {
                    'content': {
                        templateUrl: 'app/entities/data_service/id_number_verification/id_number_verification.html',
                        controller: 'IdNumberVerificationController'
                    }
                }
            });
    });
