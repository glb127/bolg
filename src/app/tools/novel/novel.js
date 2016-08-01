(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('NovelController', NovelController);


    NovelController.$inject = [ 'apiLoadLoc'];
    function NovelController (apiLoadLoc) {
    	var vm = this;
    	var loadPage=50;
    	vm.allFile=[];
    	vm.showFile=[];
    	vm.option="name";
    	vm.sortType=false;
    	vm.options={
    		"name":"名字",
            "id":"id"
    	}

    	function init() {
            apiLoadLoc.get('./no-min/20.json').then(function(data){
				vm.allFile = data;
			    vm.changeOptions();
			    
			});	
    	}

        vm.select=function(){
            vm.showFile=[];
            if(!vm.selectInfo){
                vm.changeOptions();
                return;
            }
            for(var i=0;i<vm.allFile.length;i++){
                if(vm.allFile[i].name.indexOf(vm.selectInfo)>-1){
                    vm.showFile.push(vm.allFile[i]);
                }
            }
            vm.loadMore = function() {};
        }
        vm.selectKeyup=function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                vm.select();
            }
        }


    	vm.changeOptions = function(){
    		if(vm.option=="id"){
	    		vm.allFile.sort(function(a,b){
	    			var s=b.id-a.id; 
	    			return (vm.sortType?s:-s);
	    		});
	    	}else if(vm.option=="name"){
	    		vm.allFile.sort(function(a,b){
	    			var s=b.name.localeCompare(a.name);
	    			return (vm.sortType?s:-s);
	    		});
	    	}
		    vm.showFile = vm.allFile.slice(vm.passNum||0,loadPage);
            vm.loadMore = function() {                  
                for(var i = loadPage; i --; ) {
                    if(vm.showFile.length<vm.allFile.length){
                        vm.showFile.push(vm.allFile[vm.showFile.length]);
                    }
                }
            }
    	}	
		
		init();		
    }


})();

		
			
