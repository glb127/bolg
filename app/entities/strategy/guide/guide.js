'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('strategyGuide', {
                parent: 'strategyCenter',
                url: '/guide',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.strategyCreate.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/guide/guide.html',
                        controller: 'StrategyGuideController'
                    }
                }
            });
    });
