'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('dataRule', {
                params: {'isNarrow': null},
                parent: 'dataService',
                url: '/data_rule',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.dataRule.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/data_service/data_rule/data_rule.html',
                        controller: 'DataRuleController'
                    }
                }
            });
    });
