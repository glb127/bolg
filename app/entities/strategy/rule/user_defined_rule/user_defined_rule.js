'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('addUserDefinedRuleStep1', {
                parent: 'entity',
                url: '/strategy-instance/:strategyInstanceId/add-user-defined-rule/step-1',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.userDefinedRule.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/rule/user_defined_rule/add_step_1.html',
                        controller: 'UserDefinedRuleStep1Controller'
                    }
                },
                resolve: {
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
            })
            .state('addUserDefinedRuleStep2', {
                parent: 'entity',
                url: '/strategy-instance/:strategyInstanceId/add-user-defined-rule/step-2',

                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.userDefinedRule.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/rule/user_defined_rule/add_step_2.html',
                        controller: 'UserDefinedRuleStep2Controller'
                    }
                },
                resolve: {
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
            })
            .state('addUserDefinedRuleStep3', {
                parent: 'entity',
                url: '/strategy-instance/:strategyInstanceId/add-user-defined-rule/step-3',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.userDefinedRule.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/rule/user_defined_rule/add_step_3.html',
                        controller: 'UserDefinedRuleStep3Controller'
                    }
                },
                resolve: {
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
            });

    });
