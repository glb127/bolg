'use strict';

angular.module('cloudxWebApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('newPredicator', {
                params: {isNarrow: null,strategyId:null,noslide:null},
                parent: 'ruleCenter',
                url: '/new-predicator',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '新增指标'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/predicator/new_predicator.html',
                        controller: 'newPredicatorController'
                    }
                },
                resolve: {
                    //sessionData: function(){return ['test','test'];},
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }
                
            })
            .state('editPredicator', {
                params: {isNarrow: null,type:null,strategyId:null,predicatorId:null,predicatorType:null,noslide:null},
                parent: 'ruleCenter',
                url: '/edit-predicator',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '编辑指标'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/predicator/edit_predicator.html',
                        controller: 'editPredicatorController'
                    }
                },
                resolve: {
                    //sessionData: function(){return ['test','test'];},
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }                
            })            
            .state('editPredicator1', {
                params: {isNarrow: null,type:null,strategyId:null,predicatorId:null,predicatorType:null,noslide:null},
                parent: 'ruleCenter',
                url: '/edit-predicator1',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '编辑指标'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/predicator/edit_predicator1.html',
                        controller: 'editPredicator1Controller'
                    }
                },
                resolve: {
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }                
            })   
            .state('editPredicator2', {
                params: {isNarrow: null,type:null,strategyId:null,predicatorId:null,predicatorType:null,noslide:null},
                parent: 'ruleCenter',
                url: '/edit-predicator2',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '编辑指标'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/predicator/edit_predicator2.html',
                        controller: 'editPredicator2Controller'
                    }
                },
                resolve: {
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }                
            })            
            .state('editPredicator2_1', {
                params: {isNarrow: null,type:null,strategyId:null,predicatorId:null,predicatorType:null,noslide:null},
                parent: 'ruleCenter',
                url: '/edit-predicator2-1',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '编辑指标'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/predicator/edit_predicator2_1.html',
                        controller: 'editPredicator21Controller'
                    }
                },
                resolve: {
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }                
            })            
            .state('editPredicator2_2', {
                params: {isNarrow: null,type:null,strategyId:null,predicatorId:null,predicatorType:null,noslide:null},
                parent: 'ruleCenter',
                url: '/edit-predicator2-2',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '编辑指标'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/predicator/edit_predicator2_2.html',
                        controller: 'editPredicator22Controller'
                    }
                },
                resolve: {
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }                
            })
            .state('editPredicator3', {
                params: {isNarrow: null,type:null,strategyId:null,predicatorId:null,predicatorType:null,noslide:null},
                parent: 'ruleCenter',
                url: '/edit-predicator3',
                data: {
                    roles: ['ROLE_USER'],
                    pageTitle: '编辑指标'
                },
                views: {
                    'rightslide@': {
                        templateUrl: 'app/entities/strategy/predicator/edit_predicator3.html',
                        controller: 'editPredicator3Controller'
                    }
                },
                resolve: {
                    //sessionData: function(){return ['test','test'];},
                    previousState: ["$state", function ($state) {
                        return $state.current.name;
                    }]
                }                
            })
    });
