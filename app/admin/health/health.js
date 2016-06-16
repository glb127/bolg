'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('health', {
                parent: 'admin',
                url: '/health',
                data: {
                    roles: ['ROLE_ADMIN'],
                    pageTitle: 'health.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/admin/health/health.html',
                        controller: 'HealthController'
                    }
                }
            });
    });
