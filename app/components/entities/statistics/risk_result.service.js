'use strict';

angular.module('cloudxWebApp')
    .factory('HitRuleDistribute', function ($resource) {
        return $resource('api/risk-rule/statistics', {}, {
            'query': { method: 'POST', isArray: true}
        });
    })
    .factory('HitScenarioDistribute',function($resource){
        return $resource('api/riskEvents/getScenarioDistribute', {}, {
            'query': { method:'GET', isArray: true}
        });
    });
