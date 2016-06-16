'use strict';

angular.module('cloudxWebApp')
    .config(function($stateProvider){
        $stateProvider
            .state('access', {
                params: {'isNarrow': null, 'anchor':null},
                parent: 'site',
                url: '/access',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: 'cloudxWebApp.help.access.title'
                },
                views: {
                    'content@':{
                        templateUrl: 'app/entities/helpcenter/accessHelper.html',
                        controller: 'HelpCenterController'
                    }
                }
            });
    });
