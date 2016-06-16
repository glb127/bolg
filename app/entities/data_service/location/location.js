'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('location', {
                params: {'isNarrow': null},
                parent: 'dataService',
                url: '/location',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '归属地查询'
                },
                views: {
                    'content': {
                        templateUrl: 'app/entities/data_service/location/location.html',
                        controller: 'LocationController'
                    }
                }
            });
    });
