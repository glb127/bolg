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
                    deferred.resolve(JSON.parse(myfLocalStorage.get("LeanCloud_"+fname)));
                }else{
                    AV.Cloud.run(fname, {}, {
                        success: function(data) {
                            myfLocalStorage.set("LeanCloud_"+fname,JSON.stringify(data),30*60*1000);
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