'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('newScenario', {
                params: {isNarrow: null},
                parent: 'ruleCenter',
                url: '/new_scenario',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '新增场景'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/new_scenario/new_scenario.html',
                        controller: 'NewScenarioController'
                    }
                }
                
            });
    });
