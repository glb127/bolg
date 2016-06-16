'use strict';

angular.module('cloudxWebApp')
    .factory('RiskTrend', function ($resource, DateUtils) {
        return $resource('api/riskTrend/riskTrend', {}, {
            'query': { method: 'POST', isArray: false},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    })
    /*.factory('StrategiesService',function($resource){
        return $resource('api/strategy-instances/properties',{},{
            'getStrategies':{method:'GET',isArray:true}
        })
    })*/

    .factory('StrategiesService', function($http){
        return {
            getStrategies: function () {
                return $http.get('api/strategy-instances/properties').then(function (response) {
                    return response;
                });
            }
        };
    });
