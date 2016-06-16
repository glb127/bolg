'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('configuration', {
                parent: 'admin',
                url: '/configuration',
                data: {
                    roles: ['ROLE_ADMIN'],
                    pageTitle: 'configuration.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/admin/configuration/configuration.html',
                        controller: 'ConfigurationController'
                    }
                }
            });
    });
