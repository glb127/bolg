'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('dataService', {
                params: {'isNarrow': null},
                abstract: true,
                parent: 'site',
                views: {
                    'content@': {
                        templateUrl: 'app/entities/data_service/data_service.html',
                        controller: 'DataServiceController'
                    }
                }
            });
    });
