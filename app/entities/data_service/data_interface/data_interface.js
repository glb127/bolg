'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('dataInterface', {
                params: {'isNarrow': null},
                parent: 'dataService',
                url: '/rule_interface',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.dataInterface.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/data_service/data_interface/data_interface.html',
                        controller: 'DataInterfaceController'
                    }
                }
            });
    });
