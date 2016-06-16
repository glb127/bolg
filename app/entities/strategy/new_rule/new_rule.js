'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('newRuleStep1', {
                params: {isNarrow: null,type:null,strategyId:null,scenarioId:null,solutionId:null,noslide:null},
                //type: 0规则库 1自定义
                parent: 'ruleCenter',
                url: '/new-rule-1',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '新增规则'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/new_rule/new_rule_step_1.html',
                        controller: 'newRuleStep1Controller'
                    }
                },
                resolve: {
                    //sessionData: function(){return ['test','test'];},
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
                
            })
            .state('newRuleStep2', {
                params: {isNarrow: null,scenarioId:null,solutionId:null,scenarioCode:null,noslide:null},
                parent: 'ruleCenter',
                url: '/new-rule-2',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '新增规则'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/new_rule/new_rule_step_2.html',
                        controller: 'newRuleStep2Controller'
                    }
                },
                resolve: {
                    //sessionData: function(){return ['test','test'];},
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
                
            })
            .state('newRuleStep3', {
                params: {isNarrow: null,type:null,scenarioId:null,solutionId:null,ruleId:null,noslide:null},
                //type:new/edit
                parent: 'ruleCenter',
                url: '/edit-rule',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '新增规则'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/new_rule/new_rule_step_3.html',
                        controller: 'newRuleStep3Controller'
                    }
                }
                
            });
    });
