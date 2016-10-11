(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('PicfallController', PicfallController);


    PicfallController.$inject = [ '$uibModal','$q','apiLoadLoc','apiLeanCloud'];
    function PicfallController ($uibModal,$q,apiLoadLoc,apiLeanCloud) {
    	var vm = this;
    	var loadPage=20;
    	vm.allFile=[];
    	vm.showFile=[];
        vm.size="100%";
    	function init() {
            apiLoadLoc.get('./no-min/picfall.json').then(function(data){
				vm.allFile = data;
			    vm.showFile = vm.allFile.slice(0,loadPage);
                vm.loadMore = function() {
                    for(var i = loadPage; i --; ) {
                        if(vm.showFile.length<vm.allFile.length){
                            vm.showFile.push(vm.allFile[vm.showFile.length]);
                        }
                    }
                }
			});
    	}


		init();
    }

})();



