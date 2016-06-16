'use strict';

angular.module('cloudxWebApp')
    .factory('StrategyTemplate', function ($resource) {
        return $resource('api/strategy_template/:id', {}, {
            'get': {
                method: 'GET',
                isArray: true
            }
        });
    });
