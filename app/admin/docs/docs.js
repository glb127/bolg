'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('docs', {
                parent: 'admin',
                url: '/docs',
                data: {
                    roles: ['ROLE_ADMIN'],
                    pageTitle: 'global.menu.admin.apidocs'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/admin/docs/docs.html'
                    }
                }
            });
    });
