'use strict';

angular.module('cloudxWebApp')
	.factory('ruleTemplateListInfo', function($http){
		var Strategy = '';
		var ScenarioList = [];
		return {
			setStrategy: function(StrategyInstance){
				Strategy = StrategyInstance;
			},
			setScenarioList: function(ScenarioTemplateList){
				ScenarioList = ScenarioTemplateList;
			},
			getStrategy:function(){
				return Strategy;
			},
			getScenarioList: function(){
				return ScenarioList;
			}
		};	
	});