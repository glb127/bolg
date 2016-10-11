(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$state',"apiOpen"];

    function NavbarController ($state,apiOpen) {
        var vm = this;
        vm.isNavbarCollapsed = true;

        vm.toggleNavbar = function() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        vm.collapseNavbar = function() {
            vm.isNavbarCollapsed = true;
        }

        vm.toolsList=[
            {id:"baiduyun",name:"百度云",pic:"cloud"},
            // {id:"film",name:"电影",pic:""},
            {id:"za",name:"抓爬",pic:"search"},
            {id:"weather",name:"天气",pic:"globe"},
            {id:"picfall",name:"瀑布墙",pic:"picture"},
            // {id:"novel",name:"小说",pic:"heart"},
        ]
    }
})();
