'use strict';

angular.module('cloudxWebApp')
	.factory('StrategyInstanceListService', function ($resource){
		return $resource('api/strategyInstances/getStrategyInstanceList', {}, {
			'getStrategyList': { method: 'GET', isArray: true}
		});
	})

	.factory('ScenarioTemplateListService', function($resource){
		return $resource('api/scenario-templates/:strategyInstanceId', {},{
			'getScenarioTemplateList': { method: 'GET', isArray: true}
		});
	})

	.factory('RuleTemplateListService', function($resource){
		return $resource('api/strategy-instances/rule-templates'/*?page=:page&per_page=:per_page&strategyInstanceCode=:strategyInstanceCode&strategyTemplateCode=:strategyTemplateCode&scenarioTemplateCode=:scenarioTemplateCode&solutionTemplateCode=:solutionTemplateCode'*/, {}, {//?strategyTemplateCode=GLM001', {}, {
			'getRuleTemplateList': {method: 'GET', isArray: true}
		});
	})

	.factory('createRuleInstanceService', function($resource) {
		return $resource('api/rule-instances', {}, {
			'saveNewRule': {
	            method: 'POST',
	            transformResponse: function (data) {
	                data = angular.fromJson(data);
	                return data;
	            }
			}
		});
	})
	.factory('StrategyTemplateService', function($resource){
		return $resource('api/strategy-instances/:code/simple', {}, {
			'getStrategyTemplate':{
				method:'GET',
	            transformResponse: function (data) {
	                data = angular.fromJson(data);
	                return data;
	            }
			}
		});
	});
