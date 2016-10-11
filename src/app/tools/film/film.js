(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('FilmController', FilmController)
        .controller('FilmInfoController', FilmInfoController);


    FilmController.$inject = [ '$uibModal','$q','apiLoadLoc','apiLeanCloud'];
    function FilmController ($uibModal,$q,apiLoadLoc,apiLeanCloud) {
    	var vm = this;
    	var loadPage=20;
    	vm.allFile=[];
    	vm.showFile=[];
    	vm.option="id";
    	vm.sortType=true;
    	vm.options={
    		"id":"id",
    		"name":"名字",
    		"time":"时间",
    		"star":"评分",
    	}

    	function init() {
            $q.all([apiLoadLoc.get('./no-min/film66.json'),
                    apiLeanCloud.functions("film66")])
            .then(function(data){
                if(!data[1]||data[1].length==0){
                    data[1]==[];
                }
				vm.allFile = data[0].concat(data[1]);
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

    	vm.showPic=function(ent){
    		vm.entTmp=ent;
    		$uibModal.open({
                animation: true,
                templateUrl: 'app/tools/film/filmInfo.html',
                controller: 'FilmInfoController',
                controllerAs: 'vm',
                resolve: {
			        ent: function () {
			          	return vm.entTmp;
			        }
		      	}
            });
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
	    	}else if(vm.option=="time"){
	    		vm.allFile.sort(function(a,b){
	    			var s=new Date(b.uptime)-new Date(a.uptime);
	    			return (vm.sortType?s:-s);
	    		});
	    	}else if(vm.option=="star"){
	    		vm.allFile.sort(function(a,b){
	    			var s=b.star.substring(b.star.indexOf("\">")+2,b.star.indexOf("<i"))
	    			    -a.star.substring(a.star.indexOf("\">")+2,a.star.indexOf("<i"));
	    			return (vm.sortType?s:-s);
	    		});
	    	}
		    vm.showFile = vm.allFile.slice(0,loadPage);
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


    FilmInfoController.$inject = [ '$uibModalInstance','ent'];
    function FilmInfoController ($uibModalInstance,ent) {
    	var vm = this;
    	vm.ent = ent;
    	vm.cancel=function(){    		
            $uibModalInstance.close();
    	}		
    }
})();

		
			
