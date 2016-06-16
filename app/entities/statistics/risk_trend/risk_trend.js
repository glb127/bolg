'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('riskTrend', {
                params: {'isNarrow': null},
                parent: 'statisticsAnalysis',
                url: '/risk-trend',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.riskTrend.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/statistics/risk_trend/risk_trend.html',
                        controller: 'RiskTrendController'
                    }
                }
            });
    });
