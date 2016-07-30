(function() {
    'use strict';

    angular
        .module('bolgApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('tools', {
            parent: 'app',
            url: '/tools'
        });
        $stateProvider.state('baiduyun', {
            parent: 'tools',
            url: '/baiduyun',
            data: {
                authorities: [],
                pageTitle: '百度云'
            },
            views: {
                'content@': {
                    templateUrl: 'app/tools/baiduyun/baiduyun.html',
                    controller: 'BaiduyunController',
                    controllerAs: 'vm'
                }
            }
        });
        $stateProvider.state('weather', {
            parent: 'tools',
            url: '/weather',
            data: {
                authorities: [],
                pageTitle: '天气'
            },
            views: {
                'content@': {
                    templateUrl: 'app/tools/weather/weather.html',
                    controller: 'WeatherController',
                    controllerAs: 'vm'
                }
            },
            resolve:{
                load_echarts: ['$ocLazyLoad', function($ocLazyLoad) {
                    // you can lazy load files for an existing module
                    return $ocLazyLoad.load('./no-min/echarts.min.js');
                }]
            } 
        });
        $stateProvider.state('showDemo', {
            parent: 'tools',
            url: '/showDemo',
            data: {
                authorities: [],
                pageTitle: '天气'
            },
            views: {
                'content@': {
                    templateUrl: 'app/tools/showDemo/showDemo.html',
                    controller: 'ShowDemoController',
                    controllerAs: 'vm'
                }
            }
        });
        $stateProvider.state('film', {
            parent: 'tools',
            url: '/film',
            data: {
                authorities: [],
                pageTitle: '电影'
            },
            views: {
                'content@': {
                    templateUrl: 'app/tools/film/film.html',
                    controller: 'FilmController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
