'use strict';

angular.module('cloudxWebApp')
    .factory('dataRule', function ($resource, DateUtils) {
        return $resource('api/data-service-group', {}, {
            'get': {
                method: 'GET',
                isArray: true
            }
        });
    })

    .factory('dataApi', function($resource){
        return $resource('api/api-service-group', {}, {
            'get': {
                method: 'GET',
                isArray: true
            }
        });
    })

    .factory('serviceApplication', function($resource){
        return $resource('api/data-api-service/:dataServiceCode', {}, {
            'post': {
                method: 'GET'
            }
        });
    })

    .factory('serviceGroup', function($resource){
        return $resource('api/data-service-groups', {}, {
            'get':{
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
    })

    .factory('serviceInterface', function($http){
        return {
            get: function(code) {
                return $http({
                    method: 'GET',
                    url: 'api/data-service/api-document',
                    params: code
                }).then(function(response){
                    //console.log(response);
                    return response;
                });
            }
        };
    })

    .factory('DataRule', function($http){

        return {
            getBill: function(queryData) {
                return $http({
                    method: 'GET',
                    url: 'api/data-service/bills',
                    params: queryData
                }).then(function(response){
                    return response;
                });
            }
        };
    });
