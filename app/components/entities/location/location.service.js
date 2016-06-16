'use strict';

angular.module('cloudxWebApp')
    .factory('LocalQuery', function ($resource, DateUtils) {
        return $resource('api/location/:dimension', {}, {
            'query': { method: 'GET'},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
