'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('activate', {
                parent: 'account',
                url: '/activate?key',
                data: {
                    roles: [],
                    pageTitle: '活动'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/activate/activate.html',
                        controller: 'ActivationController'
                    }
                }
            });
    });

