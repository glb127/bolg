'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('statisticsAnalysis',{
                params: {'isNarrow': null},
                abstract: true,
                parent: 'site'
            });
    });
