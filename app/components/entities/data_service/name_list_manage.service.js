'use strict';

angular.module('cloudxWebApp')
    .factory('NameListManager', function ($resource, DateUtils) {
        return $resource('api/nameList/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'save':{method:'PUT'}
        });
    })
    .factory('NameListManagerQuery',function($resource,DateUtils){
        return $resource('api/nameList/query',{},{
            'find':{method:'GET',isArray: true}
        });
    })
    .factory('NameListManagerUpdate',function($resource,DateUtils){
        return $resource('api/nameList/update',{},{
            'update': {method:'PUT'}
        });
    });
