'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('createStrategyStep1', {
                params: {'strategyCode': null} ,
                parent: 'strategyCenter',
                url: '/create-strategy/step-1',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '创建攻略'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/new/new_step_1.html',
                        controller: 'StrategyCreateStep1Controller'
                    }
                },
                resolve: {
                    //sessionData: function(){return ['test','test'];},
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
            })
            .state('createStrategyStep2', {
                params: {'strategyCode': null} ,
                parent: 'strategyCenter',
                url: '/create-strategy/step-2',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '创建攻略'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/new/new_step_2.html',
                        controller: 'StrategyCreateStep2Controller'
                    }
                },
                resolve: {
                    //sessionData: function(){return ['test','test'];},
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
            })
            .state('createStrategyStep3', {
                params: {'strategyCode': null} ,
                parent: 'strategyCenter',
                url: '/create-strategy/step-3',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '创建攻略'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/new/new_step_3.html',
                        controller: 'StrategyCreateStep3Controller'
                    }
                },
                resolve: {
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
            })
            .state('createStrategyStep4', {
                params: {'strategyId': null, 'strategyName':null} ,
                parent: 'strategyCenter',
                url: '/create-strategy/finish',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '创建攻略完成'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/new/new_step_4.html',
                        controller: 'StrategyCreateStep4Controller'
                    }
                },
                resolve: {
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
            });
    });
