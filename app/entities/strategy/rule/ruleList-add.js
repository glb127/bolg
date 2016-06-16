'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
        	.state('ruleList-add-selectStrategy', {
        		parent: 'strategyCenter',
        		url: '/ruleList-add-selectStrategy',
        		data: {
        			roles: ['ROLE_USER'],
        			pageTitle: 'cloudxWebApp.ruleList.home.title'
        		},
        		views: {
        			'content@': {
        				templateUrl: 'app/entities/strategy/rule/ruleList-add-selectStrategy.html',
        				controller: 'RuleAddStep1Controller'
        			}
        		}
        	})
        	.state('ruleList-add', {
                parent: 'strategyCenter',
                url: '/ruleList-add/:code/:strategyId',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.ruleList-add.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/rule/ruleList-add.html',
                        controller: 'RuleAddStep2Controller'
                    }
                }
            })
            .state('definedRule', {
                parent: 'entity',
                url: '/strategy-instance/:id/definedRule',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.definedRule.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/definedRule/definedRules.html',
                        controller: 'DefinedRuleController'
                    }
                }
            
        })
    });
