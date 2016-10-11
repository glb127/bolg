(function() {
    'use strict';

    angular
        .module('bolgApp')
        .controller('ZaController', ZaController);

    ZaController.$inject = [ '$scope','apiLoadLoc', 'apiLeanCloud'];
    function ZaController ($scope, apiLoadLoc, apiLeanCloud) {
        var vm = this;
    	var loadPage=5;
    	vm.allInfo=[];
    	vm.showInfo=[];
        vm.showTypeList={
            "yuebao":{title:"月报",loadPage:3},//20
            "zhoubao":{title:"周报",loadPage:5},//176
            // "w3ctech":{title:"w3ctech",loadPage:30},//1009
            // "cnode":{title:"node中文站",loadPage:30},//18193
            // "51job":{title:"前程无忧",loadPage:20},
            // "ruandan":{title:"卵蛋",loadPage:10},
            "lieqi":{title:"猎奇",loadPage:30},
            "141jav":{title:"jav",loadPage:30},
            "u77":{title:"页游",loadPage:10}
        };
        vm.locPath=["./no-min/","http://obmu2j2m7.bkt.clouddn.com/"]
        vm.showType="";
        vm.showTypeSave={id:"",name:"indexPage"};
        vm.indexScrollTop={};
        var scrollTimeout;

    	vm.getJson=function() {
            if(vm.showType){
                if(vm.showType=="gushi"){

                    apiLeanCloud.functions("tongyong",{name:"gushione"}).then(function(data){
                        vm.allInfo =  data;
                        vm.limit_placeholder=vm.allInfo[0].index+"~"+vm.allInfo[vm.allInfo.length-1].index;
                        vm.indexList=[];
                        for(var i=0;i<vm.allInfo.length;i++){
                            vm.indexList.push(vm.allInfo[i].index);
                        }
                        vm.changeFilter()
                    })

                }else{
                    apiLoadLoc.get(vm.locPath[0]+'za/'+vm.showType+'.json').then(function(data){
                        vm.allInfo = data;
                        vm.limit_placeholder=vm.allInfo[0].index+"~"+vm.allInfo[vm.allInfo.length-1].index;
                        vm.indexList=[];
                        for(var i=0;i<vm.allInfo.length;i++){
                            vm.indexList.push(vm.allInfo[i].index);
                        }
                        vm.changeFilter()
        			});
                }
            }
    	}
        vm.keyup = function(e){
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                vm.changeFilter();
            }
        };
        $(window).bind("scroll",function(){
            vm.getScrollTop();
            var scrollTop = $(document).scrollTop()+80;
            var max=0;
            for(var ent in vm.indexScrollTop){
                if(max<vm.indexScrollTop[ent]&&vm.indexScrollTop[ent]<scrollTop){
                    max=vm.indexScrollTop[ent];
                    vm.showTypeList[vm.showType].value=ent;
                }
            }
            $scope.$apply();
        });
        $scope.$on("$destroy", function() {
            $(window).unbind("scroll");
        })
        vm.changeFilter=function() {
            vm.loadMore = function() {
                if(!vm.showTypeList[vm.showType].value){
                    for(var i = vm.showTypeList[vm.showType].loadPage; i --; ) {
                        if(vm.showInfo.length<vm.allInfo.length){
                            vm.showInfo.push(vm.allInfo[vm.showInfo.length]);
                        }
                    }
                }else if(vm.showInfo.length>0){
                    var count = vm.showTypeList[vm.showType].loadPage;
                    for(var i = 0; i<vm.allInfo.length; i ++) {
                        if(+vm.showInfo[vm.showInfo.length-1].index<+vm.allInfo[i].index){
                            vm.showInfo.push(vm.allInfo[i]);
                            count--;
                            if(count==0){
                                break;
                            }
                        }
                    }
                }
            }
            if(!vm.showTypeList[vm.showType].value){
                vm.showInfo = vm.allInfo.slice(0,vm.showTypeList[vm.showType].loadPage);
            }else{
                for(var i = vm.allInfo.length; i--;) {
                    if(+vm.allInfo[i].index==+vm.showTypeList[vm.showType].value){
                        vm.showInfo=[vm.allInfo[i]];
                        vm.loadMore();
                        break;
                    }
                }
            }
        }
        vm.getScrollTop = function () {
            scrollTimeout=setTimeout(function(){
                console.log("1")
                vm.indexScrollTop={};
                for(var i=0;i<vm.showInfo.length; i++ ) {
                    vm.indexScrollTop[vm.showInfo[i].index]=$("#"+vm.showInfo[i].index).offset().top;
                }
            },300)
        }

        vm.savePage=function(){
            apiLeanCloud.save('zaPage',vm.showTypeSave.id,{
                key:vm.showTypeSave.name,
                value:vm.showType
            });
            apiLeanCloud.save('zaPage',vm.showTypeList[vm.showType].id,{
                key:vm.showType,
                value:vm.showTypeList[vm.showType].value
            });
        }
        vm.getPage=function() {
            apiLeanCloud.query('zaPage').then(function(data){
                for(var i=data.length;i--;){
                    if(data[i].attributes.key==vm.showTypeSave.name){
                        vm.showType = data[i].attributes.value;
                        vm.showTypeSave.id = data[i].id;
                    }else{
                        vm.showTypeList[data[i].attributes.key].id = data[i].id;
                        vm.showTypeList[data[i].attributes.key].value = data[i].attributes.value;
                    }
                }
                vm.getJson()
            });
        }
        vm.getPage();

    }

    function indexFilter() {
        return function(input,x) {
            if(!x){x=1;}
            var out = [];
            angular.forEach(input, function (ent) {
                if (ent % x == 0) {
                    out.push(ent);
                }
            });
            return out;
        };
    }
})();



