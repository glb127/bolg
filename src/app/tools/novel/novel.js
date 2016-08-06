(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('NovelController', NovelController);


    NovelController.$inject = [ '$state','$stateParams','apiLoadLoc','myfLocalStorage'];
    function NovelController ($state,$stateParams,apiLoadLoc,myfLocalStorage) {
    	var vm = this;
    	var loadPage=50;
        vm.passNum=0;
    	vm.allFile=[];
    	vm.showFile=[];
    	vm.option="id";
    	vm.sortType=false;
    	vm.options={
    		"name":"名字",
            "id":"id"
    	}
    	function init() {
            if($stateParams.id){
                getId($stateParams.id);
            }else{
                apiLoadLoc.get('./no-min/an77la/index.json').then(function(data){
                    data.sort(function(a,b){return a.id-b.id;}); 
                    vm.showFile = data; 
                }); 
            }
    	}
        var getId=function(id) {
            vm.infoShow = true;
            apiLoadLoc.get('./no-min/an77la/'+id+'.json').then(function(data){
                vm.allFile = data;
                vm.changeOptions();
                
            }); 
        }

        vm.goTo=function(id){
            $state.go('novel',{id:id});
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
                    if(vm.showFile.length>500){
                        alert("查询结果过多，只显示前500条")
                        break;
                    }
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
            vm.passNum=vm.passNum||0;
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
		    vm.showFile = vm.allFile.slice(vm.passNum,+vm.passNum+loadPage);
            vm.loadMore = function() {
                for(var i = loadPage; i --; ) {
                    if(+vm.passNum+vm.showFile.length<vm.allFile.length){
                        vm.showFile.push(vm.allFile[+vm.passNum+vm.showFile.length]);
                    }
                }
            }
    	}	
		
		init();		
    }


})();

		
			
