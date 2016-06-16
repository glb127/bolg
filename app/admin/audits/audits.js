'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('audits', {
                parent: 'admin',
                url: '/audits',
                data: {
                    roles: ['ROLE_ADMIN'],
                    pageTitle: 'audits.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/admin/audits/audits.html',
                        controller: 'AuditsController'
                    }
                }
            });
    });
