'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editGuide', {
                params: {isNarrow: null},
                parent: 'ruleCenter',
                url: '/edit_guide',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '攻略详情'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/edit_guide/edit_guide.html',
                        controller: 'EditGuideController'
                    }
                }
                
            });
    });
