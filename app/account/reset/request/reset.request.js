'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('requestReset', {
                parent: 'account',
                url: '/reset/request',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/reset/request/reset.request.html',
                        controller: 'RequestResetController'
                    }
                }
            });
    });
