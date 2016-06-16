'use strict';

angular.module('cloudxWebApp')
    .controller('RuleDetailController', function ($scope, focus, $uibModal,
                                                  $state, $compile, $stateParams,
                                                  getRuleInstanceHistoryService, RuleInstanceCode,
                                                  ruleDetailService, ruleInstanceDetail, ruleHistory) {

        $scope.strategyId = $stateParams.strategyId;

        //initial
        //$scope.load_flag = true;
        $scope.nameFocus = false;
        //angular.element('body').append($compile('<div ng-hide="load_flag"><div class="loading"></div><div class="loading_cover"></div></div>')($scope));

        //initial the value
        $scope.isPay = ['免费', '收费'];
        $scope.status = ['启用', '停用','不可用'];
        $scope.isSynchronization = ['实时', '非实时', '准实时'];
        $scope.authorization = {
            '-1': '未开通',
            '0': '已开通',
            '1': '申请中',
            '2': '默认开通'
        };


        $scope.defaultRuleCondition = {
            authorization: '1',
            code: 'cp_16',
            id: '55f2707cf2b26d3443af50e6',
            isPay: '0',
            isSynchronization: '0',
            name: '#n#小时内，手机号移动距离≥#x#KM'
        };

        //获取规则详情
        $scope.getRuleDetail = function () {
            //$scope.load_flag = false;
            $scope.getDetailPromise = ruleInstanceDetail.get({ruleInstanceID: $stateParams.id}, function (result) {
                $scope.ruleInstance = result;
                $scope.ruleInstanceName = $scope.ruleInstance.name;
                //$scope.ruleInstance = {name:"防重复登录", id:"123", code:"GZ12345", score:"60", strategyInstanceName:"攻略1", scenarioInstanceName:"场景1", solutionInstanceName:"锦囊1", ruleParameters:[{name:"最多登录次数", value:"3"}, {name:"一天最多不同id数", value:"3"}]};

                $scope.ruleInstanceCode = $scope.ruleInstance.code;
                $scope.ruleInstanceScore = $scope.ruleInstance.score;
                for (var i = 0; i < $scope.ruleInstance.ruleConditionInstanceDTOs.length; i++) {
                    $scope.conditionOpen.push(false);
                }

                $scope.modifyName = $scope.ruleInstance.name;
                $scope.modifyCode = $scope.ruleInstance.code;
                $scope.modifyScore = $scope.ruleInstance.score;
                //$scope.load_flag = true;

                $scope.getRuleHistory();
            }, function (result) {
                if(result.status === 400) {
                    var errorElement = '<div class="rm_content_header"><h1 class="title ">规则详情</h1></div>' +
                        '<div class="ud_panel"><div class="ud_panel_content"><p class="title ud_text_error">出错啦！</p></div></div>';
                    angular.element('#ruleDetailPage').html(errorElement);
                }
            });
        };

        //获取规则历史
        $scope.getRuleHistory = function () {
            //$scope.load_flag = false;
            /*getRuleInstanceHistoryService.getRuleInstanceHistory({ruleInstanceCode: $scope.ruleInstanceCode}, function (result) {
                $scope.ruleHistory = result;
                for (var i = 0; i < $scope.ruleHistory.length; i++) {
                    $scope.historyOpen[i] = false;
                    //$scope.historyClose[i] = true;
                }
                $scope.load_flag = true;
                //$scope.ruleHistory = [{id:'asfdsdfsdfs', code:'GZ123', name:'攻略1', operateType:'更新', score:'60', lastModifiedDate:'1437113516685'}, {id:'asfdsdfsdfsa', name:'攻略1', code:'GZ1234', operateType:'新增', score:'20', lastModifiedDate:'1137113516685'}];
                for(var i=0; i<$scope.ruleHistory.length; i++) {
                 $scope.ruleHistory[i].lastModifiedDate = $scope.timeFormat($scope.ruleHistory[i].lastModifiedDate);
                 alert($scope.ruleHistory[i].lastModifiedDate);
                 }
            });*/

            ruleHistory.get({ruleInstanceId:$stateParams.id}, {}, function(result){
                $scope.ruleHistory = result;
                for (var i = 0; i < $scope.ruleHistory.length; i++) {
                    $scope.historyOpen[i] = false;
                }
            });
        };


        $scope.init = function () {
            $scope.conditionOpen = [];
            $scope.ruleInstanceCode = $stateParams.id;

            $scope.ruleName = false;
            $scope.ruleNameModify = true;
            $scope.abandonModifyRuleName = true;
            $scope.allowModifyRuleName = false;

            $scope.ruleCode = false;
            $scope.ruleCodeModify = true;
            $scope.allowModifyRuleCode = false;
            $scope.abandonModifyRuleCode = true;
            $scope.codeRepeat = true;

            $scope.ruleScore = false;
            $scope.ruleScoreModify = true;
            $scope.allowModifyRuleScore = false;
            $scope.abandonModifyRuleScore = true;

            //$scope.ruleInstance = {name:'防重复登录', code:'GZ12345', score:'60', ruleParameters:[{name:'最多登录次数', value:'3'}, {name:'一天最多不同id数', value:'3'}]};
            //$scope.ruleHistory = [{id:'asfdsdfsdfs', name:'攻略1', operateType:'更新', score:'60', lastModifiedDate:'1437113516685'}, {id:'asfdsdfsdfsa', name:'攻略1', operateType:'新增', score:'20', lastModifiedDate:'1137113516685'}];


            $scope.historyOpen = [];
            //$scope.historyClose = [];

            $scope.getRuleDetail();

        };

        $scope.init();

        //operation
        $scope.modifyRuleProperty = function () {
            $scope.ruleProperties = {
                name: $scope.ruleInstance.name,
                id: $scope.ruleInstance.id,
                code: $scope.ruleInstance.code,
                isPay: $scope.ruleInstance.isPay,
                isSynchronization: $scope.ruleInstance.isSynchronization,
                ruleConditionInstances: $scope.ruleInstance.ruleConditionInstanceDTOs,
                ruleParameters: $scope.ruleInstance.ruleParameters,
                scenarioInstanceName: $scope.ruleInstance.scenarioInstanceName,
                score: $scope.ruleInstance.score,
                solutionInstanceName: $scope.ruleInstance.solutionInstanceName,
                status: $scope.ruleInstance.status,
                strategyInstanceName: $scope.ruleInstance.strategyInstanceName,
                description: $scope.ruleInstance.description
            };

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'modifyRuleProperty.html',
                controller: 'rulePropertyController',
                resolve: {
                    ruleProperties: function () {
                        return $scope.ruleProperties;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result === 'update') {
                    $scope.init();
                }
                else {
                    $state.go('ruleCenter', {strategyId: $scope.strategyId});
                }
            });
        };

        $scope.modifyRuleCondition = function (index) {
            console.log($scope.ruleInstance.ruleConditionInstanceDTOs);
            $scope.conditionProperties = {
                code: $scope.ruleInstance.ruleConditionInstanceDTOs[index].code,
                apiConfigs: $scope.ruleInstance.ruleConditionInstanceDTOs[index].apiConfigs,
                authorization: $scope.ruleInstance.ruleConditionInstanceDTOs[index].authorization,
                calculationConfigs: $scope.ruleInstance.ruleConditionInstanceDTOs[index].calculationConfigs,
                dataServiceCode: $scope.ruleInstance.ruleConditionInstanceDTOs[index].dataServiceCode,
                id: $scope.ruleInstance.ruleConditionInstanceDTOs[index].id,
                isPay: $scope.ruleInstance.ruleConditionInstanceDTOs[index].isPay,
                isSynchronization: $scope.ruleInstance.ruleConditionInstanceDTOs[index].isSynchronization,
                loadingConfigs: $scope.ruleInstance.ruleConditionInstanceDTOs[index].loadingConfigs,
                name: $scope.ruleInstance.ruleConditionInstanceDTOs[index].name,
                ruleBody: $scope.ruleInstance.ruleConditionInstanceDTOs[index].ruleBody,
                ruleConditionTemplateCode: $scope.ruleInstance.ruleConditionInstanceDTOs[index].ruleConditionTemplateCode,
                status: $scope.ruleInstance.ruleConditionInstanceDTOs[index].status,
                version: $scope.ruleInstance.ruleConditionInstanceDTOs[index].version
            };
            $scope.conditionProperties.ruleParameters = [];

            for(var i=0; i<$scope.ruleInstance.ruleConditionInstanceDTOs[index].ruleParameters.length; i++){
                $scope.conditionProperties.ruleParameters.push({name:$scope.ruleInstance.ruleConditionInstanceDTOs[index].ruleParameters[i].name,
                                                                    value:$scope.ruleInstance.ruleConditionInstanceDTOs[index].ruleParameters[i].value,
                                                                    key:$scope.ruleInstance.ruleConditionInstanceDTOs[index].ruleParameters[i].key,
                                                                    defaultValue:$scope.ruleInstance.ruleConditionInstanceDTOs[index].ruleParameters[i].defaultValue,
                                                                    type:$scope.ruleInstance.ruleConditionInstanceDTOs[index].ruleParameters[i].type});
            }

            var modalInstance = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'modifyRuleCondition.html',
                controller: 'ruleConditionController',
                resolve: {
                    conditionProperties: function () {
                        return $scope.conditionProperties;
                    },
                    ruleProperties: function () {
                        return {
                            ruleInstanceId: $scope.ruleInstance.id,
                            strategyName: $scope.ruleInstance.strategyInstanceName,
                            status: $scope.ruleInstance.status
                        };
                    }
                }
            });


            modalInstance.result.then(function (result) {
                if (result == 'success') {
                    $scope.init();
                }

            });
        };

        $scope.openCloseCollapse = function (index) {
            $scope.historyOpen[index] = !$scope.historyOpen[index];
            //$scope.historyClose[index] = !$scope.historyClose[index];
        };

        $scope.openCloseCondition = function (index) {
            $scope.conditionOpen[index] = !$scope.conditionOpen[index];
        };


        $scope.checkModification = function () {
            if ($scope.ruleInstance.code != $scope.ruleInstanceCode) {
                return 1;
            }

            if ($scope.ruleInstance.name != $scope.ruleInstanceName) {
                return 1;
            }

            if ($scope.ruleInstance.score != $scope.ruleInstanceScore) {
                return 1;
            }

            for (var i = 0; i < $scope.ruleInstance.ruleParameters.length; i++) {
                if ($scope.ruleInstance.ruleParameters[i].value != $scope.ruleInstanceParams[i].value) {
                    return 1;
                }
            }

            return 0;

        };
        //ui-sref="ruleCenter({strategyCode: $stateParams.strategyCode})"

        $scope.del = function () {
            if ($scope.ruleInstance.status == '1') {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'deleteEnsure.html',
                    controller: 'ruleIsUsedController'
                });
                modalInstance.result.then(function () {
                    ruleDetailService.delete({ruleInstanceId: $scope.ruleInstance.id}, {}, function () {
                        $state.go('ruleCenter', {strategyId: $scope.strategyId});
                    });
                });
            }
            else {
                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'ruleIsUsed.html',
                    controller: 'ruleIsUsedController'
                });
            }
        };
    })

    .controller('ruleIsUsedController', function ($scope, $uibModalInstance/*getRuleInstanceDetailService, getRuleInstanceHistoryService*/) {
        //$scope.resultContent = resultContent;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.next = function () {
            $uibModalInstance.close();
        };
    })

    .controller('rulePropertyController', function ($scope, $uibModalInstance, $state, ruleProperties, ruleDetail, $uibModal, ruleDetailService, RuleInstanceCode) {
        $scope.ruleProperties = ruleProperties;

        //initial the value
        $scope.isPay = ['免费', '收费'];
        $scope.status = ['删除', '启用', '停用'];
        $scope.isSynchronization = ['实时', '非实时', '准实时'];
        $scope.codeIsNull = false;
        $scope.codeRepeat = false;
        $scope.nameIsNull = false;
        $scope.scoreIsNull = false;
        $scope.scoreInvalid = false;
        $scope.oldCode = $scope.ruleProperties.code;
        $scope.oldName = $scope.ruleProperties.name;
        $scope.oldScore = $scope.ruleProperties.score;
        $scope.oldStatus = $scope.ruleProperties.status;
        $scope.oldDescription = $scope.ruleProperties.description;

        if ($scope.ruleProperties.status == '0') {
            $scope.status = true;
        }

        else {
            $scope.status = false;
        }

        $scope.setRuleStatus = function () {
            if ($scope.ruleProperties.status == '0') {
                $scope.ruleProperties.status = '1';
            }
            else {
                $scope.ruleProperties.status = '0';
            }
            $scope.status = !$scope.status;
        };

        $scope.save = function () {

            if ($scope.ruleProperties.name === $scope.oldName && $scope.ruleProperties.code === $scope.oldCode &&  $scope.ruleProperties.score === $scope.oldScore && $scope.oldStatus === $scope.ruleProperties.status && $scope.oldDescription === $scope.ruleProperties.description) {

                $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'updateEnsure_noChange.html',
                    controller: 'ruleIsUsedController'
                });
            }
            else if ($scope.check_all()) {
               $scope.savePromise = ruleDetail.put({ruleInstanceId: $scope.ruleProperties.id}, $scope.ruleProperties, function () {
                    $uibModalInstance.close('update');
                });
            }
        };

        $scope.del = function () {
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.check_code = function () {
            $scope.codeIsNull = false;
            $scope.codeRepeat = false;

            if ($scope.ruleProperties.code != $scope.oldCode) {

                if ($scope.ruleProperties.code === '') {
                    $scope.codeIsNull = true;
                }
                else {
                    RuleInstanceCode.checkRuleInstanceCode({code: $scope.ruleProperties.code}, function (result) {
                        if (result.result === true) {
                            $scope.codeRepeat = true;
                        }
                    });
                }
            }
        };

        $scope.check_name = function () {
            $scope.nameIsNull = false;
            if ($scope.ruleProperties.name === '') {
                $scope.nameIsNull = true;
            }
        };

        $scope.check_score = function () {
            $scope.scoreIsNull = false;
            $scope.scoreInvalid = false;
            if ($scope.ruleProperties.score === '') {
                $scope.scoreIsNull = true;
            }
            else if ($scope.ruleProperties.score > 100 || $scope.ruleProperties.score < 1 || parseInt($scope.ruleProperties.score) != $scope.ruleProperties.score) {

                $scope.scoreInvalid = true;
            }
        };

        $scope.check_all = function () {
            $scope.check_name();

            if ($scope.ruleProperties.code != $scope.oldCode) {
                $scope.check_code();
                $scope.check_score();
            }

            if ($scope.nameIsNull === false &&
                $scope.codeIsNull === false &&
                $scope.codeRepeat === false &&
                $scope.scoreIsNull === false &&
                $scope.scoreInvalid === false) {
                return true;
            }
            else {
                return false;
            }
        };
    })

    .controller('ruleConditionController', function ($scope, $uibModal, $uibModalInstance, $state, conditionProperties, ruleCondition, ruleProperties) {
        $scope.conditionProperties = conditionProperties;
        $scope.ruleProperties = ruleProperties;
        $scope.oldValue = [];
        $scope.isNull = [];
        $scope.valueInvalid = [];
        console.log(conditionProperties);
        console.log(conditionProperties);

        for (var i = 0; i < $scope.conditionProperties.ruleParameters.length; i++) {
            $scope.oldValue.push({value: $scope.conditionProperties.ruleParameters[i].value});
            $scope.isNull[i] = false;
            $scope.valueInvalid[i] = false;
        }


        //initial the value
        $scope.isPay = ['免费', '收费'];
        $scope.status = ['删除', '启用', '停用'];
        $scope.isSynchronization = ['实时', '非实时', '准实时'];

        $scope.save = function () {
            if ($scope.check_change() && $scope.check_invalid() ) {
                $scope.parameters = [];
                for (var i = 0; i < $scope.conditionProperties.ruleParameters.length; i++) {
                    $scope.parameters.push($scope.conditionProperties.ruleParameters[i]);
                }

                $scope.params = {parameters: $scope.parameters};
                $scope.savePromise = ruleCondition.put({
                    ruleInstanceID: $scope.ruleProperties.ruleInstanceId,
                    ruleConditionInstanceID: $scope.conditionProperties.id
                }, $scope.params, function () {
                    $uibModalInstance.close('success');
                });
            }
        };


        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };

        $scope.del = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    backdrop: 'static',
                    templateUrl: 'deleteConditionEnsure.html',
                    controller: 'deleteConditionController',
                    resolve: {
                        ids: function () {
                            return {
                                conditionId: $scope.conditionProperties.id,
                                ruleId: $scope.ruleProperties.ruleInstanceId
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result == 'fail') {
                        $uibModalInstance.close('fail');
                    }
                    else {
                        $uibModalInstance.close('success');
                    }
                });
        };

        //check
        $scope.check_change = function(){
            for (var j = 0; j < $scope.conditionProperties.ruleParameters.length; j++) {
                if ($scope.conditionProperties.ruleParameters[j].value != $scope.oldValue[j].value) {
                    return true;
                }
            }

            var modal = $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'updateEnsure_noChange.html',
                controller: 'ruleIsUsedController'
            });
            modal.result.then(function () {
                return false;
            });
        };

        $scope.check_invalid = function () {
            var result = true;
            for (var i = 0; i < $scope.conditionProperties.ruleParameters.length; i++) {
                $scope.isNull[i] = false;
                $scope.valueInvalid[i] = false;
                if ($scope.conditionProperties.ruleParameters[i].value === '') {
                    $scope.isNull[i] = true;
                    result = false;
                }
                else{
                    if($scope.conditionProperties.ruleParameters[i].type == 'int'){
                        if (!(/^\+?[1-9][0-9]*$/.test($scope.conditionProperties.ruleParameters[i].value))) {
                            $scope.valueInvalid[i] = true;
                            result = false;
                        }   
                    }
                }
            }
            return result;
        };
    })
    .controller('deleteConditionController', function ($scope, $uibModal, $uibModalInstance, ruleCondition, ids) {
        console.log(ids);
        $scope.ruleInstanceId = ids.ruleId;
        $scope.conditionId = ids.conditionId;

        $scope.next = function () {
            ruleCondition.delete({
                ruleInstanceID: $scope.ruleInstanceId,
                ruleConditionInstanceID: $scope.conditionId
            }).$promise.then(function () {
                    $uibModalInstance.close('success');
                },
                function (err) {
                    $uibModalInstance.close('fail');
                    console.log(err);
                    if (err.data == 'current condition can\'t be deleted') {
                        $uibModal.open({
                            animation: true,
                            backdrop: 'static',
                            templateUrl: 'cannotDelCondition.html',
                            controller: 'ruleIsUsedController'
                        });
                    }
                });
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    })
;
