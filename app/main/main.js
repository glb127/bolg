'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('home', {
                params: {isNarrow: null},
                parent: 'site',
                url: '/',
                data: {
                    roles: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'app/main/main.html',
                        controller: 'MainController'
                    }
                }
            });
    });
