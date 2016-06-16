'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('password', {
                parent: 'account',
                url: '/password',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '密码'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/password/password_step_1.html',
                        controller: 'PasswordStep1Controller'
                    }
                }
            })
            .state('passwordStep2', {
                parent: 'account',
                url: '/password',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '密码'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/password/password_step_2.html',
                        controller: 'PasswordStep2Controller'
                    }
                }
            });
    });
