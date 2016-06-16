'use strict';

angular.module('cloudxWebApp')
    .factory('User', function ($resource) {
        return $resource('api/users/:login', {}, {
                'query': {method: 'GET', isArray: true},
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        data = angular.fromJson(data);
                        return data;
                    }
                }
            });
        })
    .factory('Balance',function($resource){
        return $resource('api/user/balance',{}, {
            'get':{
                method: 'GET',
                transformResponse: function(data){
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
    })
    .factory('NewBalance', function($resource){
        return $resource('api/user/newBalance', {}, {
            'get': {
                method: 'GET',
                transformResponse: function(data){
                    data = angular.fromJson(data);
                    return data;
                }
            }
        });
    })
    .factory('BalanceTip', function(){
        var flag = true;
        return {
            show: function () {
                return flag;
            },
            close: function () {
                flag = false;
            }
        };
    })
    .factory('UserInformation', function($http) {
        return {
            get: function() {
                return $http.get('api/users/details').then(function(response) {
                    return response.data;
                });
            }
        };
    })
;
