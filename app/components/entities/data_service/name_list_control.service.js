'use strict';

angular.module('cloudxWebApp')
    .factory('NameListControl', function ($resource, DateUtils) {
        return $resource('api/nameListControls1/:id', {}, {
            'query': { method: 'GET',isArray:true},
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
