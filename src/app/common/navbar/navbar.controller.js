(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state'];

    function NavbarController ($state) {
        var vm = this;
        vm.isNavbarCollapsed = true;

        vm.toggleNavbar = function() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        vm.collapseNavbar = function() {
            vm.isNavbarCollapsed = true;
        }
    }
})();
