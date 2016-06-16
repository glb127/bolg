'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('riskResult', {
                params: {'isNarrow': null},
                parent: 'statisticsAnalysis',
                url: '/risk-result',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.riskResult.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/statistics/risk_result/risk_result.html',
                        controller: 'RiskResultController'
                    }
                }
            });
    });
