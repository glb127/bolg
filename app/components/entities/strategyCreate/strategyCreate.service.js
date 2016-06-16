'use strict';

angular.module('cloudxWebApp')
    .factory('MerchantTypes', function($http){
        var merchantTypes = [];
        return {
            //get avaliable merchant types
            get: function () {
                return $http.get('api/merchant_type_instance').then(function (response) {
                    return response.data;
                });
            },
            set: function(data){
                merchantTypes = data;
            }
        };
    })

    .factory('Strategy', function($http){
        var strategy = {};
        var myStrategy = {};
        var rules = [];
        var strategyConfiguration = {};
        var i, j, k = 0;
        var tmpArray = [];
        var tmpObj = {};

        return {
            //get strategyInstanceDTO
            //should by merchantType ????? ?????
            get: function(code){
                return $http.get('api/strategy-template/'+code).then(function(response){
                    strategy = response.data;
                    for(var i=0; i<strategy.scenarioInstanceDTOs.length; i++){
                        strategy.scenarioInstanceDTOs[i].check = true;
                        for(var j=0; j<strategy.scenarioInstanceDTOs[i].solutionInstanceDTOs.length; j++){
                            strategy.scenarioInstanceDTOs[i].solutionInstanceDTOs[j].check = true;
                        }
                    }
                    strategyConfiguration = {
                        strategyInstanceCode: strategy.strategyInstanceCode,
                        name: strategy.name,
                        blockScore: strategy.blockScore,
                        decisionPolicy: "最坏匹配",
                        riskLevelDefinitions: strategy.riskLevelDefinitions
                    };
                    return response.data;
                });
            },

            validateCode: function(data){
                return $http.get('api/strategy-instances/'+data+'/code').then(function(response){
                    return response.data;
                });
            },

            validateName: function(data){
            	return $http.get('api/strategy-instances/'+data+'/name').then(function(response){
            		return response.data;
            	});
            },

            save: function(myStrategy){
                return $http.post('api/strategy-instances', myStrategy)
                    .success(function(data, status){
                        console.log(status);
                        return data;
                    })
                    .error(function(data, status) {
                        console.error(status);
                        return data;
                    });

            }
        }
    })

    .factory("saveNewStrategyService", function($resource){
    	return $resource('api/strategyInstance', {}, {
			'save1':{
				method:"POST",
				transformResponse: function (data) {
                    return data;
				}
			}
		})
    })

    .factory("sessionData", function(){
        var tmp = {};
        return {
            get: function(){
                return tmp;
            },

            set: function(data){
                tmp = data;
            }
        }
    })
;
