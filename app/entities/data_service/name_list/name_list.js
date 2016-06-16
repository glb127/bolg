'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('nameList', {
                params: {'isNarrow': null},
                parent: 'eventCenter',
                url: '/name-list',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.nameListManager.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/data_service/name_list/name_list.html',
                        controller: 'NameListController'
                    }
                }
            });
    });
