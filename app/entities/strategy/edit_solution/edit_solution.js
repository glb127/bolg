'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('editSolution', {
                params: {isNarrow: null,type:null,scenarioId:null,solutionId:null},
                //type:new/edit
                parent: 'ruleCenter',
                url: '/edit_solution',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '添加锦囊'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/edit_solution/edit_solution.html',
                        controller: 'EditSolutionController'
                    }
                }
                
            });
    });
