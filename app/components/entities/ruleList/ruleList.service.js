'use strict';

angular.module('cloudxWebApp')
	.factory('getRuleInstanceListService', function ($resource){
		return $resource('api/rule-instances/search-condition', {}, {
			'getRuleInstanceList': {
				method: 'POST',
				isArray: true
			}
		});
	})
	.factory('getSearchPropertiesService', function($resource){
		return $resource('api/rule-instances/properties', {}, {
			'getSearchProperties':{
				method:'GET',
				isArray:true
			}
		});
	})
	.factory('ruleDetailService', function($resource){
		return $resource('api/rule-instances/:ruleInstanceId',{}, {
			'updateRuleInstance': {
				method:'PUT',
				transformResponse: function (data) {
                    return data;
				}
			},
			'delete':{
				method:'DELETE',
				transformResponse: function (data) {
					return data;
				}
			}
		});
	})
	.factory('ruleInstanceDetail', function($resource){
		return $resource('api/rule-instances/:ruleInstanceID', {}, {
			'get': {
				method:'GET',
				transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
				}
			}
		});
	})

	.factory('ruleDetail', function($resource){
		return $resource('api/rule-instance/:ruleInstanceId', {}, {
			'put': {
				method:'PUT'
			}
		});
	})

	.factory('getRuleInstanceHistoryService', function($resource){
		return $resource('api/rule-instance-histories/:ruleInstanceCode', {}, {
			'getRuleInstanceHistory': {method:'GET', isArray:true}
		});
	})

	.factory('RuleInstanceCode', function($resource){
		return $resource('api/rule-instances/:code/code', {}, {
			'checkRuleInstanceCode': {
				method:'GET',
				transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
				}
			}
		});
	})

	.factory('updateRuleInstanceStatusService', function($resource){
		return $resource('api/rule-instances/:id/status', {}, {
			'updateRuleInstanceStatus':{method:'PUT'}
		});
	})

	.factory('DeletedRule', function($resource){
		return $resource('api/rule-instances/search-deletion', {}, {
			'searchDeletedRule':{
				method:'POST',
				isArray:true
			}
		});
	})

	.factory('strategyProperty', function($resource){
		return $resource('api/strategy-instances/:strategyInstanceId/detail',{}, {
			'get': {
				method:'GET',
				transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
				}
			}
		});
	})

	.factory('strategyInstanceList', function($resource){
		return $resource('api/strategy-instances', {}, {
			'get':{
				method:'GET',
				isArray:true
			}
		});
	})

	.factory('ruleInstanceList', function($resource){
		return $resource('api/strategy-instance/:strategyInstanceId/rule-instances', {}, {
			'get':{
				method:'GET'
			}
		});
	})

	.factory('ruleConditionList', function($resource){
		return $resource('api/ rule-condition/rule-conditions', {}, {
			'get':{
				method:'GET',
				isArray:true,
				transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data.ruleConditionDTOs;
				}
			}
		});
	})

	.factory('ruleCondition', function($resource){
		return $resource('api/rule-instances/:ruleInstanceID/rule-conditions/:ruleConditionInstanceID', {}, {
			'post':{
				method:'POST',
				transformResponse: function (data) {
                    console.log(data);
                    return data;
				}
			},
			'put':{
				method:'PUT'
			},
			'delete':{
				method:'DELETE'
			}
		});
	})

    .factory('interfaceField', function($resource){
        return $resource('api/strategy-instances/interface-field/:strategyInstanceID', {}, {
            'get': {
                method: 'GET',
                isArray: true,
                transformResponse: function(data){
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
    })

    .factory('ruleHistory', function($resource){
        return $resource('api/rule-instance/:ruleInstanceId/history',{},{
            'get': {
                method: 'GET',
                isArray: true,
                transformResponse: function(data){
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
    })
;
