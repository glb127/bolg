'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('eventLog', {
                params: {
                    'isNarrow': null,
                    'queryCondition': {},
                    'dname':null,
                    'dcode':null,
                    'dvalue':null
                },
                parent: 'site',
                url: '/event-log&:dname&:dcode&:dvalue',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '事件日志'
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/event/event_log/event_log.html',
                        controller: 'EventLogController'
                    }
                }
            });
        
    })
    .config(function ($stateProvider) {
        $stateProvider
            .state('eventLogDetail', {
                parent: 'eventLog',
                params: {'isNarrow': null, 'eventlogid':null,'esEventLogId':null},
                url: '/:eventlogid',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '事件详情'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/event/event_log/event_log-detail.html',
                        controller: 'EventLogDetailController'
                    }
                }
            });
    });
