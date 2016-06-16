'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('eventCenter', {
                params: {
                    'isNarrow': null
                },
                abstract: true,
                parent: 'site'
            });
    });
