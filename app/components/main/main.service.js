'use strict';

angular.module('cloudxWebApp')
    .factory('Top10BlockRule', function ($resource) {
        return $resource('api/risk_rule/top_block_rule', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',isArray:true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    })

    .factory('Top10HitRule', function ($resource) {
        return $resource('api/risk_rule/top_hit_rule', {}, {
            'get': {
                method: 'GET',isArray:true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
    })
    .factory('RiskEventStatistics', function ($resource) {
        return $resource('api/riskEvents/riskEventStatistics', {}, {
            'get': {
                method: 'GET',isArray:true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
    })
    .factory('RiskLevelStatistics',function($resource){
        return $resource('api/riskEvents/riskLevelStatistics',{},{
             'get': {
                method: 'GET',isArray:true,
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            }
        })
    });
