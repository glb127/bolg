'use strict';

angular.module('cloudxWebApp')
    .factory('Message', function ($resource) {
        return $resource('api/notice', {}, {
            'query': {method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                },
                isArray: true
            },
            'update': {method: 'PUT'}
        });
    })
;
