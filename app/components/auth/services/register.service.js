'use strict';

angular.module('cloudxWebApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


