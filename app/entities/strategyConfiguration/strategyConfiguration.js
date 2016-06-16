'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('strategyConfiguration', {
                parent: 'strategyCenter',
                url: '/strategyConfiguration',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.strategyConfiguration.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategyConfiguration/strategyConfigurations.html',
                        controller: 'StrategyConfigurationController'
                    }
                }
            })
            .state('strategyConfigurationDetail', {
                parent: 'strategyCenter',
                url: '/strategyConfiguration/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.strategyConfiguration.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategyConfiguration/strategyConfiguration-detail.html',
                        controller: 'StrategyConfigurationDetailController'
                    }
                }
            })
            .state('strategyView', {
            	parent:'strategyCenter',
            	url: '/strategyView/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.strategyConfiguration.detail.title'
                },
                views: {
                    'navbarside@': {
                        templateUrl: 'app/components/navbar/navbarside.html',
                        controller: 'NavbarsideController'
                    },
                    'content@': {
                        templateUrl: 'app/entities/strategyConfiguration/strategyView.html',
                        controller: 'StrategyViewController'
                    }
                }
            })
            .state('interfaceField', {
                parent:'strategyCenter',
                url: '/strategyView/interfaceField/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.strategyConfiguration.detail.title'
                },
                views: {
                    'navbarside@': {
                        templateUrl: 'app/components/navbar/navbarside.html',
                        controller: 'NavbarsideController'
                    },
                    'content@': {
                        templateUrl: 'app/entities/strategyConfiguration/interfaceField.html',
                        controller: 'InterfaceFieldController'
                    }
                }
            });
    });
