'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('logs', {
                parent: 'admin',
                url: '/logs',
                data: {
                    roles: ['ROLE_ADMIN'],
                    pageTitle: 'logs.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/admin/logs/logs.html',
                        controller: 'LogsController'
                    }
                }
            });
    });
