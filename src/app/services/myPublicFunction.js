(function() {
    'use strict';

    angular
        .module('bolgApp')
        .factory('myfLocalStorage', myfLocalStorage);

    function myfLocalStorage () {
        var storage = window.localStorage;
        var set = function(key,value,time){
            if(storage){
                if(angular.isObject(value)){
                    storage.setItem(key,JSON.stringify(value));
                }else{
                    storage.setItem(key,value);
                }
                if(time){
                    storage.setItem(key+"__overtime",+new Date+time);
                }
                return true;
            }else{
                return false;
            }
        }
        var get = function(key,isObj){
            if(storage){
                if(storage.getItem(key+"__overtime")){
                    if(+new Date<=storage.getItem(key+"__overtime")){
                        return isObj?JSON.parse(storage.getItem(key)):storage.getItem(key);
                    }else{
                        return null;
                    }
                }else{
                    return isObj?JSON.parse(storage.getItem(key)):storage.getItem(key);
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