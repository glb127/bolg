'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('metrics', {
                parent: 'admin',
                url: '/metrics',
                data: {
                    roles: ['ROLE_ADMIN'],
                    pageTitle: 'metrics.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/admin/metrics/metrics.html',
                        controller: 'MetricsController'
                    }
                }
            });
    });
