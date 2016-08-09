(function() {
    'use strict';

    angular
        .module('bolgApp')
        .factory('apiLoadLoc', apiLoadLoc);

    apiLoadLoc.$inject = ['$q','$http'];
       
    function apiLoadLoc ($q,$http) {
        var service = {
            get : function(loc){
                var defer = $q.defer();
                $http.get(loc).success(function(data,status,headers,congfig){
                    //console.log(status);
                    //console.log(headers);
                    //console.log(congfig);
                    defer.resolve(data);
                }).error(function(data,status,headers,congfig){
                    defer.reject(data);
                });
                return defer.promise
            }
        }
        return service;
    }
})();