'use strict';

angular.module('cloudxWebApp')

    .factory('EventLog', function($http){

        return {
            queryByConditions: function (queryData) {
                return $http({
                    method: 'GET',
                    url: 'api/event-log',
                    params: queryData
                }).success(function(response, status, headers){
                    //console.log(headers('link'));
                    return response;
                }).error(function(response) {
                    console.error(response);
                });

                /*return $http.get('api/event-log').then(function (response) {
                 return response.data;
                 });*/
            },

            queryByKeyword: function (queryData) {
                return $http({
                    method: 'GET',
                    url: 'api/event-log/keyword',
                    params: queryData
                }).success(function(response){
                    return response;
                }).error(function(response) {
                    console.error(response);
                });
            },

            queryByEncryptedKeyword: function (queryData) {
                return $http({
                    method: 'GET',
                    url: 'api/event-log/keyword/encryption',
                    params: queryData
                }).then(function(response) {
                    return response;
                });
            }
        };
    })

    .factory('EventLogCondition', function($http) {
        return {
            strategies: function() {
                return $http.get('api/event-log/strategies').then(function(response) {
                    return response.data;
                });
            },
            scenarios: function(strategiesId) {
                return $http.get('api/event-log/' + strategiesId + '/scenarios').then(function(response) {
                    return response.data;
                });
            },
            solutions: function(strategiesId, scenairoId) {
                return $http.get('api/event-log/' + strategiesId + '/' + scenairoId + '/solutions').then(function(response) {
                    return response.data;
                });
            },
            dimensions: function() {
                return $http.get('api/event-log/dimensions').then(function(response) {
                    return response.data;
                });
            },
            rules: function() {
                return $http.get('api/evnet-log/rules').then(function(response) {
                    return response.data;
                });
            }
        };
    })

    /*.factory('EventLogCondition',function($resource){
        return $resource('api/event-log/condition',{},{
            'query': {
                method: 'GET',
                isArray: true
            }
        });
    })*/

    .factory('EventLogDetail', function($http){
        return {
            get: function (eventId) {
                return $http.get('api/event-log/'+eventId).then(function (response) {
                    return response.data;
                });
            }
        };
    });
