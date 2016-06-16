'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('strategyCenter', {
            	params: {'strategyId': null, 'isNarrow':null} ,
                parent: 'site',
                url: '/strategy',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '攻略中心'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/strategy_abstract.html',
                        controller: 'StrategyCenterController'
                    }
                }
            })
    });
