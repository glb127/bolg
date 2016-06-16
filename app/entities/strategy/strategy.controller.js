'use strict';

angular.module('cloudxWebApp')
    .controller('StrategyCenterController', function ($scope, $state, $stateParams,apiStrategy) {
    	apiStrategy.get({},function(data){
            if (angular.equals(data.length, 0)) {
                $state.go('strategyGuide');
            }else {
            	if($stateParams.strategyId){
	                $state.go('ruleCenter', {strategyId:$stateParams.strategyId});
	            }else{
	            	$state.go('ruleCenter', {strategyId:data[0].id});
	            }
            }
        });

    });
