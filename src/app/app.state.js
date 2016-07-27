(function() {
    'use strict';

    angular
        .module('bolgApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider.state('app', {
            abstract: true,
            views: {
                'navbar@': {
                    templateUrl: 'app/common/navbar/navbar.html',
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                }
            }
        });
    }
})();
