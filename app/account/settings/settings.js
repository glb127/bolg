'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('settings', {
                parent: 'account',
                url: '/settings',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'global.menu.account.settings'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/settings/settings.html',
                        controller: 'SettingsController'
                    }
                }
            });
    });
