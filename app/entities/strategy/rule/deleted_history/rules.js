'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('deleteRuleHistory', {
            	parent: 'strategyCenter',
            	url: '/delete-history/list/:strategyId',
            	data: {
            		roles: ['ROLE_USER'],
            		pageTitle: 'cloudxWebApp.ruleList.deleteHistory.title'
            	},
            	views: {
            		'content@': {
            			templateUrl:'app/entities/strategy/rule/deleted_history/deleted_rule.html',
            			controller:'deleteRuleHistoryController'
            		}
            	}
            })
            .state('deleteRuleHistoryDetail', {
            	parent: 'strategyCenter',
            	url: '/delete-history-detail/:id/:strategyId',
            	data: {
            		roles: ['ROLE_USER'],
            		pageTitle: 'cloudxWebApp.ruleList.deleteHistoryDetail.title'
            	},
            	views: {
            		'content@': {
            			templateUrl:'app/entities/strategy/rule/deleted_history/deleted_rule-detail.html',
            			controller:'deleteRuleHistoryDetailController'
            		}
            	}
            });
    });
