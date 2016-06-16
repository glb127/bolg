'use strict';

angular.module('cloudxWebApp')
    .factory('DefinedRule', function ($resource, $http) {
        return {
            get: function (data) {
                return $http.get('api/strategy-instance/'+data.strategyInstanceId+'/scenario-instance')
                    .success(function (response, status) {
                        return response;
                    })
                    .error(function (data, status) {
                        return data;
                    });
            },
            getRuleConditions: function(data){
                return $http.get('api/rule-condition/rule-conditions')
                    .success(function(response){
                        return response;
                    })
                    .error(function(data,status){
                        return data;
                    });
            },

            getStrategyInstanceName: function (data) {
                return $http.get('api/strategyInstance/' + data.strategyInstanceId)
                    .success(function (data) {
                        return data;
                    })
                    .error(function (data, status) {
                        return data;
                    });
            },

            save: function(userDefinedRule){
                return $http.post('api/strategy-instance/strategyInstanceId/scenario-instance/scenarioInstanceCode/rule-instance', userDefinedRule)
                    .success(function(data){
                        return data;
                    })
                    .error(function(data, status) {
                        return data;
                    });

            }
        }
    })

    .factory("udrData", function(){
        var tmpData = {};
        return {
            get: function(){
                return tmpData;
            },
            set: function(data){
                tmpData = data;
            }
        }
    })
;

