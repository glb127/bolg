'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('nameLists', {
                params: {'isNarrow': null},
                //params: {'strategyId': null} ,
                parent: 'site',
                url: '/name-lists',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '名单列表'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/strategy/name_list/name_list.html',
                        controller: 'NameListsController'
                    }
                }
            });
    })
    .config(function ($stateProvider) {
        $stateProvider
            .state('editNameLists', {
                params: {'isNarrow': null, type:null, nameListId:null,dataValueId:null},
                //type new/edit
                parent: 'nameLists',
                url: '/edit',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '名单编辑'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/name_list/edit_name_list.html',
                        controller: 'EditNameListsController'
                    }
                }
            });
    });
