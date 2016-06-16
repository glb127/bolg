'use strict';

angular.module('cloudxWebApp')

    .factory('RiskEventCondition',function($resource){
        return $resource('api/riskEvents/condition',{},{
            'query': {
                method: 'GET',
                isArray: true
            }
        });
    })

    .factory('searchByConditionDTO', function($http){
        return {
            query: function (condition) {
                return $http({
                    method: 'GET',
                    url: 'api/riskEvents/conditionDTO',
                    params: condition
                }).then(function(response){
                    return response;
                });
            }
        };
    })

    .factory('openRisk',function($resource){
        return $resource('api/riskEvents/risk',{},{
            'query': {
                method:'GET'
            }
        });
    })

    .factory('UpdateRemark',function($resource){
        return $resource('api/riskEvents/remark',{},{
            'update': {
                method:'PUT'
            }
        });
    })

    .factory('RiskEvent', function($http){
        return {
            /**
             * search risk event by keyword (event ID or account ID)
             */
            query: function (condition) {
                return $http({
                    method: 'GET',
                    url: 'api/risk-event/keywords',
                    params: condition
                }).then(function(response){
                    return response;
                });
            }
        };
    })

    .factory('RiskEventDetail', function($http){

        return {
            get: function (eventId) {

                return $http({
                    method: 'GET',
                    url: 'api/risk-event/event-details',
                    params: eventId
                }).success(function(response){
                    return response.data;
                }).error(function(response) {
                    console.error(response);
                });

            }

        };
    });
