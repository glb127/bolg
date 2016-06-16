'use strict';

angular.module('cloudxWebApp')
    .factory('api_strategiesNames', function($resource){
        return $resource('_api/strategies/names/:name', {}, {
            'get': {
                method:"GET",
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
    })
    .factory('api_strategiesCodes', function ($resource) {
        return $resource('_api/strategies/codes/:code', {}, {
            'code': {
                url: '_api/strategies/codes/code',
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
    })
    .factory('api_strategies', function ($resource) {
        return $resource('_api/strategies/:strategyId', {}, {
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'save':{method:'POST'},
            'update': { method:'PUT' }
        });
    });

    ;
