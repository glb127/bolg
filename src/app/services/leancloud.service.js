(function() {
    'use strict';

    angular
        .module('bolgApp')
        .factory('apiLeanCloud', apiLeanCloud);

    apiLeanCloud.$inject = ['$q','myfLocalStorage'];

    function apiLeanCloud ($q,myfLocalStorage) {
        AV.init({
            appId: 'BcjvMsRSFqPvuxCRbUmhwOtU-gzGzoHsz',
            appKey: 'rQV77q18DvrAp5oPClWJESP7'
        });
        var service = {
            functions : function(fname,obj){
                obj=obj||{}
                var deferred = $q.defer();
                var locSave = myfLocalStorage.get("LeanCloud_"+fname);
                if(locSave&&locSave.obj==obj){
                    deferred.resolve(locSave.data);
                }else{
                    AV.Cloud.run(fname, obj, {
                        success: function(data) {
                            myfLocalStorage.set("LeanCloud_"+fname,{data:data,obj:obj},30*60*1000);
                            deferred.resolve(data);
                        },error:function(error){
                            deferred.reject(error);
                        }
                    });
                }
                return deferred.promise;
            },
            query : function(name){
                var deferred = $q.defer();
                var query = new AV.Query(name);
                query.find().then(function (data) {
                    deferred.resolve(data);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            save : function(name,id,obj){
                var todo ;
                if(id){
                    todo = AV.Object.createWithoutData(name, id);
                }else{
                    var Todo = AV.Object.extend(name)
                    todo = new Todo();
                }
                for(var i in obj){
                    todo.set(i, obj[i]);
                }
                todo.save();
            }
        }
        return service;
    }
})();
