'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('entity', {
                params: {'isNarrow': null},
                abstract: true,
                parent: 'site'
            });
    });
