(function() {
    'use strict';

    angular
        .module('bolgApp')
        .factory('apiOpen', apiOpen);

    apiOpen.$inject = ['$resource'];

    function apiOpen ($resource) {
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
