(function() {
    'use strict';

    angular
        .module('bolgApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('demo1', {
            parent: 'account',
            url: '/demo',
            data: {
                authorities: [],
                pageTitle: 'demo'
            },
            views: {
                'content@': {
                    templateUrl: 'app/show/demo1.html',
                    controller: 'DemoController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
