'use strict';

angular.module('cloudxWebApp')
    .factory('RealNameAuthentication', function ($resource) {
        return $resource('api/realNameAuthentications', {}, {
            'query': {
                method: 'POST'
            },
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }

            },
            'update': {method: 'PUT'}
        });
    });
