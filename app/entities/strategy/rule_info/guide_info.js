'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('guideInfo', {
                params: {isNarrow: null},
                parent: 'ruleCenter',
                url: '/guide_info',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '攻略详情'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/guide_info/guide_info.html',
                        controller: 'GuideInfoController'
                    }
                }
                
            });
    });
