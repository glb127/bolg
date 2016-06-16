'use strict';

angular.module('cloudxWebApp')
    .controller('StrategyConfigurationEditController', function ($scope, $compile, strategyConfiguration, StrategyConfiguration, Strategy, $uibModal, $uibModalInstance, StrategyInstance) {

        $scope.strategyConfiguration = {};

        var setStrategyConfiguration = function (obj) {
            obj.blockScore = strategyConfiguration.blockScore;
            obj.code = strategyConfiguration.code;
            obj.decisionPolicy = strategyConfiguration.decisionPolicy;
            obj.name = strategyConfiguration.name;
            obj.platforms = [];
            angular.copy(strategyConfiguration.platforms, obj.platforms);
            obj.riskLevelVisualizationDefinitions = [];
            angular.copy(strategyConfiguration.riskLevelVisualizationDefinitions, obj.riskLevelVisualizationDefinitions);
        };
        setStrategyConfiguration($scope.strategyConfiguration);

        $scope.platforms = [];
        $scope.strategyName = $scope.strategyConfiguration.name;

        $scope.riskLevelMap = {
            4: '极高风险',
            3: '高风险',
            2: '中风险',
            1: '低风险',
            0: '极低风险'
        };

        StrategyConfiguration.getPlatforms($scope.strategyConfiguration.code).then(function (data) {
            // set 'check' key of platform
            $scope.platforms = data.data;
            for (var i = 0; i < $scope.platforms.length; i++) {
                for (var j = 0; j < $scope.strategyConfiguration.platforms.length; j++) {
                    $scope.platforms[i].check = false;
                    if ($scope.platforms[i].name == $scope.strategyConfiguration.platforms[j].name) {
                        $scope.platforms[i].check = true;
                        break;
                    }
                }
            }

            drawVernier();
        });

        var riskLevelDefinitionData = [];
        var blockScoreData = [$scope.strategyConfiguration.blockScore];
        function drawVernier() {
            for(var i=0; i<$scope.strategyConfiguration.riskLevelVisualizationDefinitions.length-1; i++) {
                riskLevelDefinitionData.push($scope.strategyConfiguration.riskLevelVisualizationDefinitions[i].max);
            }

            var riskLevelDefinitionText = ['极低风险', '低风险', '中风险', '高风险', '极高风险'];
            var riskDealStrategyText = ['放行', '阻止'];
            $scope.rldVernierData = vernierRiskLevel('riskLevelDefinitionBar', riskLevelDefinitionData, 400, 0, 100, 5, riskLevelDefinitionText);    //风险等级定义滑动条
            $scope.bsVernierData = vernierRiskDeal('riskDealStrategyBar', blockScoreData, 300, 0, 100, 1, riskDealStrategyText);   //风险处理策略滑动条
        }

        // check platform(s)
        $scope.checkPlatform = function (index) {
            $scope.tip_platform = {invalid: false, info: ''};
            $scope.platforms[index].check = !($scope.platforms[index].check);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.collapseFlag = false;
        $scope.switch = function () {
            $scope.collapseFlag = !($scope.collapseFlag);
        };

        $scope.tip_platform = {invalid: false, info: ''};
        $scope.tip_name = {invalid: false, info: ''};
        $scope.tip_code = {invalid: false, info: ''};
        $scope.tip_riskDealStrategy = {invalid: false, info: ''};
        $scope.tip_all = {invalid: false, info: ''};
        $scope.tip_riskLevelList = [];
        for(var i=0; i<5; i++) {
            $scope.tip_riskLevelList[i] = {invalid: false, info: ''};
        }

        //验证应用平台：至少选择一个平台
        $scope.validate_platform = function () {
            $scope.tip_all = {invalid: false, info: ''};

            for (var i = 0; i < $scope.platforms.length; i++) {
                if ($scope.platforms[i].check === true) {
                    $scope.tip_platform = {invalid: false, info: ''};
                    return true;
                }
            }
            $scope.tip_platform = {invalid: true, info: '请选择应用平台'};
            return false;
        };

        //验证攻略名称：不为空且不重复
        $scope.validate_name = function () {
            $scope.tip_all = {invalid: false, info: ''};

            if ($scope.strategyName === '') {    //未输入攻略名称
                $scope.tip_name = {invalid: true, info: '请输入攻略名称'};
            } else if ($scope.strategyConfiguration.name == $scope.strategyName) {  //输入的攻略名和原攻略名一致
                $scope.tip_name = {invalid: false, info: '此攻略名称可用'};
            } else {
                Strategy.validateName($scope.strategyName).then(function (data) {
                    if (!data) {
                        $scope.tip_name = {invalid: false, info: '此攻略名称可用'};
                    } else {
                        $scope.tip_name = {invalid: true, info: '攻略名重复'};
                    }
                });
            }
            return !$scope.tip_name.invalid;
        };

        //风险处理策略验证
        var numReg = /[0-9]/;
        $scope.validate_dealStrategy = function () {
            $scope.tip_riskDealStrategy = {invalid: false, info: ''};
            var blockScore = Number($scope.strategyConfiguration.blockScore);

            if (!(numReg.test(blockScore))) {
                $scope.tip_riskDealStrategy = {invalid: true, info: '格式不正确，请重新输入数值'};
            } else if (blockScore <= 0 || blockScore >= 100) {
                $scope.tip_riskDealStrategy = {invalid: true, info: '需在0-100区间内，请重新输入数值'};
            } else {
                $scope.tip_riskDealStrategy = {invalid: false, info: ''};
            }
            return !$scope.tip_riskDealStrategy.invalid;
        };

        //风险等级定义联动
        $scope.updateMax = function (i, data) {
            $scope.tip_riskLevelList[i] = {invalid: false, info: ''};
            data = Number(data);
            if (!(/[0-9]/.test(data))) {
                $scope.tip_riskLevelList[i] = {invalid: true, info: '格式不正确，请重新输入数值'};
            } else if (data <= 0 || data >= 100) {
                $scope.tip_riskLevelList[i] = {invalid: true, info: '分值需在0-100区间内，请重新输入数值'};
            } else {
                $scope.strategyConfiguration.riskLevelVisualizationDefinitions[i - 1].max = (data - 1).toString();
            }
        };

        //风险等级定义联动
        $scope.updateMin = function (i, data) {
            $scope.tip_riskLevelList[i] = {invalid: false, info: ''};
            data = Number(data);
            if (!(/[0-9]/.test(data))) {
                $scope.tip_riskLevelList[i] = {invalid: true, info: '格式不正确，请重新输入数值'};
            } else if (data <= 0 || data >= 100) {
                $scope.tip_riskLevelList[i] = {invalid: true, info: '分值需在0-100区间内，请重新输入数值'};
            } else {
                $scope.strategyConfiguration.riskLevelVisualizationDefinitions[i + 1].min = (data + 1).toString();
            }
        };

        //验证风险等级定义
        $scope.validate_riskLevel = function () {
            $scope.tip_all = {invalid: false, info: ''};

            for (var i = 0; i < $scope.strategyConfiguration.riskLevelVisualizationDefinitions.length; i++) {
                if ($scope.tip_riskLevelList[i].invalid || $scope.strategyConfiguration.riskLevelVisualizationDefinitions[i].max <= $scope.strategyConfiguration.riskLevelVisualizationDefinitions[i].min) {
                    $scope.tip_riskLevelList[i] = {invalid: true, info: '不正确，请重新输入数值'};
                    return false;
                }
            }
            $scope.tip_riskLevelList[i] = {invalid: false, info: ''};
            return true;
        };

        $scope.validate = function () {

            if($scope.validate_platform() && $scope.validate_name() && $scope.validate_dealStrategy() && $scope.validate_riskLevel()) {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
            $scope.tip_all = {invalid: true, info: '请根据错误提示修改内容'};
            return false;
        };



        $scope.save = function () {

            // 根据拖拽条上游标的值更新相应数据
            for(var i=0; i<$scope.strategyConfiguration.riskLevelVisualizationDefinitions.length; i++) {
                if(i<4) {
                    $scope.strategyConfiguration.riskLevelVisualizationDefinitions[i].max = riskLevelDefinitionData[i];
                }
                if(i>0) {
                    $scope.strategyConfiguration.riskLevelVisualizationDefinitions[i].min = riskLevelDefinitionData[i-1]+1;
                }
            }
            $scope.strategyConfiguration.blockScore = blockScoreData[0];

            if($scope.validate()) {

                $scope.strategyConfiguration.platforms = [];
                //remove 'check' key of platform
                for(var i=0; i<$scope.platforms.length; i++) {
                    if($scope.platforms[i].check === true) {
                        $scope.platforms[i].check = undefined;
                        $scope.strategyConfiguration.platforms.push($scope.platforms[i]);
                    }
                }

                var toUpdateStrategyInstance = {
                    code: $scope.strategyConfiguration.code,
                    name: $scope.strategyName,
                    decisionPolicy: $scope.strategyConfiguration.decisionPolicy,
                    blockScore: $scope.strategyConfiguration.blockScore,
                    riskLevelDefinitions: $scope.strategyConfiguration.riskLevelVisualizationDefinitions,
                    platforms: $scope.strategyConfiguration.platforms
                };

                $scope.savePromise = StrategyInstance.update(
                    {
                        code: $scope.strategyConfiguration.code
                    },
                    toUpdateStrategyInstance,
                    function (result) {
                        //TODO: result
                        //补全result字段
                        result.merchantName = strategyConfiguration.merchantName;
                        result.dataServiceVisualizationDTOs = strategyConfiguration.dataServiceVisualizationDTOs;
                        result.scenarioVisualizationInstanceDTOs = strategyConfiguration.scenarioVisualizationInstanceDTOs;
                        $uibModalInstance.close(result);
                    },
                    function (result) {
                        console.log(result);
                    });
            }
        };
    });
