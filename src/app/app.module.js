(function() {
    'use strict';

    angular
        .module('bolgApp', [
            'ngResource',
            'ngCookies',
            'ui.bootstrap',
            'ui.router',
            'infinite-scroll',
            'ngSanitize',
            'oc.lazyLoad',
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'angular-loading-bar'
        ])
        .run(run);

    run.$inject = ['stateHandler'];

    function run(stateHandler) {
        stateHandler.initialize();
    }
})();
