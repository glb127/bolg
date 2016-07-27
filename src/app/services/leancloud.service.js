(function() {
    'use strict';

    angular
        .module('bolgApp')
        .factory('LeanCloud', LeanCloud);

    LeanCloud.$inject = ['$q'];
       
    function LeanCloud ($q) {
        AV.init({
            appId: 'BcjvMsRSFqPvuxCRbUmhwOtU-gzGzoHsz',
            appKey: 'rQV77q18DvrAp5oPClWJESP7'
        });
        var service = {
            functions : function(fname){
                var deferred = $q.defer();
                AV.Cloud.run('baiduyuns', {}, {
                    success: function(data) {
                        deferred.resolve(data);
                    },error:function(error){
                        deferred.reject(error);
                    }
                });
                return deferred.promise;
            }
        }
        return service;
    }
})();