'use strict';

angular.module('cloudxWebApp')
    .factory('StrategyConfiguration', function ($resource, $http) {
        /*return $resource('api/strategyInstances/:code', {}, {
            //'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    console.log(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });*/
        //var myStrategyConfiguration = {};
        return {
            get: function (code) {
                return $http.get('api/strategy-instances/'+code)
                    .success(function (response, status) {
                        console.log(response);
                        return response;
                    })
                    .error(function (data, status) {
                        console.error(status);
                    });
            },
            update: function(data){
                //myStrategyConfiguration = data;
                //console.log(data);
                return $http.put('api/strategy-instances/'+data.code, data)
                    .success(function(data, status){
                        console.log(data);
                        console.log(status);
                    })
                    .error(function(status) {
                        console.error(status);
                    });
            },
            getPlatforms: function(){
            	return $http.get('api/platforms')
            			.success(function(response){
            				return response;
            			})
            			.error(function(data){
            				console.error(status);
            			});
            }

        };
    })
    ;
