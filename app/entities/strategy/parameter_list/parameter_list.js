'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('parameterList', {
                params: {'isNarrow': null},
                //params: {'strategyId': null} ,
                parent: 'site',
                url: '/parameter-list',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '字段列表'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/parameter_list/parameter_list.html',
                        controller: 'ParameterListController'
                    }
                }
            });
    })
    .config(function ($stateProvider) {
        $stateProvider
            .state('editParameterList', {
                params: {'isNarrow': null,type:null, detail:null},
                //type new/edit
                parent: 'parameterList',
                url: '/edit',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '字段编辑'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/parameter_list/edit_parameter_list.html',
                        controller: 'EditParameterListController'
                    }
                }
            });
    });
