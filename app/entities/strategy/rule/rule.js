'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('ruleCenter', {
                params: {'isNarrow': null,'strategyId': null,'tag':null},
                //params: {'strategyId': null} ,
                parent: 'strategyCenter',
                url: '/rule/:strategyId/',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '规则中心'
                },
                views: {
                    'navbarside@': {
                        templateUrl: 'app/components/navbar/navbarside.html',
                        controller: 'NavbarsideController'
                    },
                    'content@': {
                        templateUrl: 'app/entities/strategy/rule/rule.html',
                        controller: 'RuleController'
                    }
                }
            })
            .state('ruleDetail', {
                parent: 'strategyCenter',
                url: '/ruledetail/:strategyId/:id',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '规则详情'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/rule/rule-detail.html',
                        controller: 'RuleDetailController'
                    }
                }
            })
        	.state('ruleCondition', {
	            parent: 'strategyCenter',
	            url: '/ruleCondition/:strategyId/:id',
	            data: {
	                roles: ['ROLE_USER'],
	                pageTitle: '工作条件'
	            },
	            views: {
	                'content@': {
	                    templateUrl: 'app/entities/strategy/rule/ruleCondition-add.html',
	                    controller: 'RuleConditionController'
	                }
	            }
	        });
    });
