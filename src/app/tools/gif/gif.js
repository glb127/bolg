(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('GifController', GifController);

    GifController.$inject = [ 'apiLoadLoc'];
    function GifController (apiLoadLoc) {
    	var vm = this;
    	var loadPage=5;
    	vm.allGif=[];
    	vm.showGif=[];

    	function init() {
            apiLoadLoc.get('./no-min/1~10000.json').then(function(data){
				vm.allGif = data;
			    vm.changeOptions();
			    
			});	
    	}

    	vm.changeOptions = function(){
		    vm.showGif = vm.allGif.slice(0,loadPage);
            vm.loadMore = function() {                  
                for(var i = loadPage; i --; ) {
                    if(vm.showGif.length<vm.allGif.length){
                        vm.showGif.push(vm.allGif[vm.showGif.length]);
                    }
                }
            }
    	}	
		
		init();		
    }


})();

		
			
