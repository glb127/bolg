'use strict';

angular.module('cloudxWebApp')
    .controller('StrategyConfigurationDetailController', function ($scope, $state, $http, $uibModalInstance, $stateParams, strategyConfiguration, StrategyConfiguration, Strategy) {
        $scope.strategyConfiguration = strategyConfiguration;
        $scope.tip_name = {invalid: false,info:""};
        $scope.originConfiguration = {name:""};
        $scope.originConfiguration.name = $scope.strategyConfiguration.name;
        //$scope.strategyConfiguration.code = 'GL4916';  //static

        $scope.riskLevelMap = {
                4: '极高风险',
                3: '高风险',
                2: '中风险',
                1: '低风险',
                0: '极低风险'
            };

        //风险等级验证相关
        $scope.riskMsg = ['','','','',''];
        var numReg = /[0-9]/;
        var rlFlag = true;

        //验证风险等级定义
        $scope.risklevelValidate = function () {
            rlFlag = true;
            for(var i=0; i<strategyConfiguration.riskLevelDefinitions.length; i++) {
                if( strategyConfiguration.riskLevelDefinitions[i].max <= strategyConfiguration.riskLevelDefinitions[i].min ) {
                    $scope.riskMsg[i] = '不正确，请重新输入数值';
                    rlFlag = false;
                }
            }
            return rlFlag;
        };

        //风险等级联动
        $scope.updateMax = function(index, data) {
            $scope.riskMsg[index] = '';
            data = Number(data);
            if( !(numReg.test(data)) ) {
                $scope.riskMsg[index] = '格式不正确，请重新输入数值';
            } else if( data<=0 || data>=100 ) {
                $scope.riskMsg[index] = '分值需在0-100区间内，请重新输入数值';
            } else {
                strategyConfiguration.riskLevelDefinitions[index-1].max = (data-1).toString();
            }
        };

        $scope.updateMin = function(index, data) {
            $scope.riskMsg[index] = '';
            data = Number(data);
            if( !(numReg.test(data)) ) {
                $scope.riskMsg[index] = '格式不正确，请重新输入数值';
            } else if( data<=0 || data>=100 ) {
                $scope.riskMsg[index] = '分值需在0-100区间内，请重新输入数值';
            } else {
                strategyConfiguration.riskLevelDefinitions[index+1].min = (data+1).toString();
            }
        };

        //风险处理策略验证
        var dsFlag = true;
        $scope.dealStrategyMsg = '';
        $scope.dealStrategyValidate = function() {
            $scope.dealStrategyMsg = '';
            dsFlag = true;
            var blockScore = Number(strategyConfiguration.blockScore);
            if( !(numReg.test(blockScore)) ) {
                $scope.dealStrategyMsg = '格式不正确，请重新输入数值';
                dsFlag = false;
            } else if( blockScore<=0 || blockScore>=100 ) {
                $scope.dealStrategyMsg = '需在0-100区间内，请重新输入数值';
                dsFlag = false;
            }
        };

        $scope.cancel = function(){
            $uibModalInstance.dismiss("cancel");
        };

        $scope.update = function(){
            $scope.risklevelValidate();
            if(rlFlag && dsFlag) {
                var tmp = {
                    //"code": $scope.code,
                    "code": $scope.strategyConfiguration.strategyInstanceCode,
                    "name": $scope.strategyConfiguration.name,
                    "decisionPolicy": $scope.strategyConfiguration.decisionPolicy,
                    "blockScore": $scope.strategyConfiguration.blockScore,
                    "riskLevelDefinitions": $scope.strategyConfiguration.riskLevelDefinitions,
                    "platforms": $scope.strategyConfiguration.platforms
                };

                StrategyConfiguration.update(tmp).then(function(data){
                	console.log('update successfully'+$scope.strategyConfiguration.strategyInstanceCode);
                    $state.go("ruleCenter", {strategyCode:$scope.strategyConfiguration.strategyInstanceCode,aaa:Math.random()});
                    $uibModalInstance.close();
                });
            }
        };

        $scope.validate_name = function() {
        	if( $scope.strategyConfiguration.name==""){
        		$scope.tip_name = {invalid: true, info: '攻略名不能为空'};
        	}
        	else if($scope.strategyConfiguration.name != $scope.originConfiguration.name){
            	Strategy.validateName( $scope.strategyConfiguration.name).then(function(data){
            		if(!data){
            			$scope.tip_name = {invalid: false, info: ''};
            		} else {
            			$scope.tip_name = {invalid: true, info: '攻略名重复'};
            		}
            	}) ;
        	}
        	return !($scope.tip_name.invalid);
        };

    })

    .controller("StrategyConfigurationPlatformsController", function ($scope, $compile, strategyConfiguration, StrategyConfiguration, Strategy, $uibModal, $uibModalInstance) {
    	$scope.StrategyConfiguration = strategyConfiguration;
        $scope.passCheck = true;

        if ($scope.platforms == undefined) {
        	StrategyConfiguration.getPlatforms($scope.StrategyConfiguration.strategyInstanceCode).then(function (data) {
                // set all platforms unchecked
                for (var i = 0; i < data.data.length; i++) {
                	for (var j=0; j<$scope.StrategyConfiguration.platforms.length; j++ ){
                		data.data[i].check = false;
                		if(data.data[i].name == $scope.StrategyConfiguration.platforms[j].name){
                            data.data[i].check = true;
                			break;
                		}
                	}
                }
                $scope.platforms = data.data;
            });
        }

        $scope.check = function (index) {
            $scope.platforms[index].check = !($scope.platforms[index].check);
            $scope.validate();
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss("cancel");
        };


        $scope.validate = function () {
            for (var i = 0; i < $scope.platforms.length; i++) {
                if ($scope.platforms[i].check == true) {
                    $scope.passCheck = true;
                    return true;
                }
            }
            $scope.passCheck = false;
            return false;
        };

        $scope.previous = function () {
            $uibModalInstance.close();
        };

        $scope.saveAndNext = function () {
        	if($scope.validate()){
        		$scope.StrategyConfiguration.platforms = [];
        		for(var i=0; i<$scope.platforms.length; i++){
        			if($scope.platforms[i].check == true) {
        				delete $scope.platforms[i].check;
        				$scope.StrategyConfiguration.platforms.push($scope.platforms[i]);
        			}
        		}

                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: "static",
                    templateUrl: 'app/entities/strategyConfiguration/strategyConfiguration-detail.html',
                    controller: 'StrategyConfigurationDetailController',
                    resolve: {
                    	strategyConfiguration: function () {
                            return $scope.StrategyConfiguration;
                        }
                    }
                });
                $uibModalInstance.close(modalInstance);
        	}

        };

    });
