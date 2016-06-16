'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('finishReset', {
                parent: 'account',
                url: '/reset/finish?key',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'app/account/reset/finish/reset.finish.html',
                        controller: 'ResetFinishController'
                    }
                }
            });
    });
