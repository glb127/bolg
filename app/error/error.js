'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('error', {
                parent: 'site',
                url: '/error',
                data: {
                    roles: [],
                    pageTitle: '错误'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/error/error.html'
                    }
                }
            })
            .state('accessdenied', {
                parent: 'site',
                url: '/accessdenied',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'app/error/accessdenied.html'
                    }
                }
            });
    });
