(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('BaiduyunController', BaiduyunController);


    BaiduyunController.$inject = [ '$timeout'];

    function BaiduyunController ($timeout) {
        var vm = this;
        vm.info="123"
        vm.getBaiduyun = function(){
            document.getElementById("info").innerHTML="</br>loading...";
            AV.Cloud.run('baiduyuns', {}, {
                success: function(data) {
                    data.sort(function(a,b){return new Date(b.time)-new Date(a.time)});
                    var chongfu={};
                    for(var i=data.length;i--;){
                        if(chongfu[data[i].url]){
                            data.splice(i,1);
                        }else{
                            chongfu[data[i].url]=1;
                        }
                    }
                    var str="";
                    for(var i=0;i<data.length;i++){
                        str+='<br/><a href="'+data[i].url+'" target="_blank">'+data[i].time+"</a>";
                    }
                    document.getElementById("info").innerHTML=str
                }
            });
        }
    }
})();
