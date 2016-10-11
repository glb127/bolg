(function() {
    'use strict';

    angular
        .module('bolgApp')
        .factory('apiOpen', apiOpen);

    apiOpen.$inject = ['$resource'];

    function apiOpen ($resource) {
        var service = $resource("", {}, {
            'baiduWeather': { 
                url:'http://api.map.baidu.com/telematics/v3/weather',
                method: 'JSONP', 
                params: {location:'@location',output:'json',ak:'VNzVAdKLqIs3RQ1br2UB10Wf',callback : 'JSON_CALLBACK'},
                transformResponse: function (data) {
                    return data;
                }
            },
            'get': { 
                url:'https://service.udcredit.com:10000/api/device-fingerprint/ie8',
                method: 'GET', 
                params: {version:'@version'},
                transformRequest: function(data, headers, status, fns){
                    console.log(data);
                    return data;
                },transformResponse: function (data) {
                    return data;
                }
            }
                
        });

        return service;
    }
})();
