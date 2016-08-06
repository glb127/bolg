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
            functions : function(fname){                
                var deferred = $q.defer();
                if(myfLocalStorage.get("LeanCloud_"+fname)){
                    deferred.resolve(myfLocalStorage.get("LeanCloud_"+fname,true));
                }else{
                    AV.Cloud.run(fname, {}, {
                        success: function(data) {
                            myfLocalStorage.set("LeanCloud_"+fname,data,30*60*1000);
                            deferred.resolve(data);
                        },error:function(error){
                            deferred.reject(error);
                        }
                    });
                }
                return deferred.promise;
            }
        }
        return service;
    }
})();