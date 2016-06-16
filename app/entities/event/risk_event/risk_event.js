'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('riskEvent', {
                params: {'isNarrow': null},
                parent: 'eventCenter',
                url: '/risk-event',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.riskEvent.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/event/risk_event/risk_event.html',
                        controller: 'RiskEventController'
                    }
                }
            })
            .state('riskEventDetail', {
                parent: 'eventCenter',
                url: '/risk-event/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.riskEvent.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/event/risk_event/risk_event-detail.html',
                        controller: 'RiskEventDetailController'
                    }
                },
                params: {
                    'eventId': ''
                }
            })
            .state('riskEventDetailDeal', {
                parent: 'eventCenter',
                url: '/risk-event/:id/deal',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.riskEvent.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/event/risk_event/risk_event-deal.html',
                        controller: 'RiskEventDealController'
                    }
                },
                params: {
                    'prevState': '',
                    'eventId': ''
                }
            });
    });
