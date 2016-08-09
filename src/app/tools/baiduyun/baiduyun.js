(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('BaiduyunController', BaiduyunController);


    BaiduyunController.$inject = ['apiLeanCloud','myfLocalStorage'];

    function BaiduyunController (apiLeanCloud,myfLocalStorage) {
        var vm = this;
        vm.info = [];
        vm.wait = false;

        vm.getBaiduyun = function(){
            vm.wait=true;
            apiLeanCloud.functions("baiduyuns").then(
                function(data){
                    data.sort(function(a,b){return new Date(b.time)-new Date(a.time)});
                    var chongfu={};
                    for(var i=data.length;i--;){
                        if(chongfu[data[i].url]){
                            data.splice(i,1);
                        }else{
                            chongfu[data[i].url]=1;
                        }
                    }
                    vm.wait=false;
                    vm.info = data;
                },function(error){
                    alert("error");
                    vm.wait=false;
                    vm.info = [];
                });

        }
    }
})();
