'use strict';

angular.module('cloudxWebApp')
    .factory('StrategyInstance', function ($resource) {
        return $resource('api/strategy_instance/:id', {}, {
            'count': {
                url: 'api/strategy-instances/count',
                method: 'GET',
                isArray: false,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                url: 'api/strategy-instances/:code'
            }
        });
    })
    .factory('strategyVisualization', function($resource){
    	return $resource('api/strategy-instance/:strategyInstanceId', {}, {
    		'get': {
    			method:"GET",
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
    		}
    	});
    })
    .factory('dataServiceOfSolution', function($resource){
    	return $resource('api/solution-instance/:solutionInstanceId/data-service', {}, {
    		'get': {
    			method:"GET",
    			isArray: true
    		}
    	});
    })
    ;
