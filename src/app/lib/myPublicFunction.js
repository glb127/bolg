(function() {
    'use strict';

    angular
        .module('bolgApp')
        .factory('myfLocalStorage', myfLocalStorage);

    function myfLocalStorage () {
        var storage = window.localStorage;
        var set = function(key,value,time){
            if(storage){
                storage.setItem(key,value);
                if(time){
                    storage.setItem(key+"__overtime",+new Date+time);
                }
                return true;
            }else{
                return false;
            }
        }
        var get = function(key){
            if(storage){
                if(storage.getItem(key+"__overtime")){
                    if(+new Date<=storage.getItem(key+"__overtime")){
                        return storage.getItem(key);
                    }else{
                        return null;
                    }
                }else{
                    return storage.getItem(key);
                }
            }else{
                return null
            }
        }
        return {
            set:set,
            get:get
        };
    }
})();