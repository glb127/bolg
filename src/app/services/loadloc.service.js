(function() {
    'use strict';

    angular
        .module('bolgApp')
        .factory('MyApi', MyApi);

    MyApi.$inject = ['$resource'];

    function MyApi ($resource) {
        var service = $resource('http://api.map.baidu.com/telematics/v3/weather', {}, {
            'baiduWeather': { 
                method: 'JSONP', 
                params: {location:'@location',output:'json',ak:'VNzVAdKLqIs3RQ1br2UB10Wf',callback : 'JSON_CALLBACK'},
                transformResponse: function (data) {
                    return data;
                }
            }
        });

        return service;
    }
})();


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