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

        $stateProvider.state('za', {
            parent: 'tools',
            url: '/za',
            data: {
                authorities: [],
                pageTitle: '抓爬杂货铺'
            },
            views: {
                'content@': {
                    templateUrl: 'app/tools/za/za.html',
                    controller: 'ZaController',
                    controllerAs: 'vm'
                }
            }
        });

        $stateProvider.state('novel', {
            parent: 'tools',
            url: '/novel/:id',
            data: {
                authorities: [],
                pageTitle: '小说'
            },
            views: {
                'content@': {
                    templateUrl: 'app/tools/novel/novel.html',
                    controller: 'NovelController',
                    controllerAs: 'vm'
                }
            }
        });

         $stateProvider.state('picfall', {
            parent: 'tools',
            url: '/picfall',
            data: {
                authorities: [],
                pageTitle: '瀑布流'
            },
            views: {
                'content@': {
                    templateUrl: 'app/tools/picfall/picfall.html',
                    controller: 'PicfallController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
