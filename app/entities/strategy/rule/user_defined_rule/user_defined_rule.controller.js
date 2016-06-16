'use strict';

angular.module('cloudxWebApp')
    .controller('UserDefinedRuleStep1Controller', function ($scope, $stateParams, DefinedRule, $state, previousState, udrData, strategyInstanceList) {

        //TODO ->state?
        $scope.udrData = udrData.get();
        $scope.udrData.strategyInstanceId = $stateParams.strategyInstanceId;
        $scope.udrData.sum = $scope.udrData.sum || 0;
        $scope.isPay = {
            "-1": "全部",
            "0": "免费",
            "1": "付费"
        };
        $scope.isSynchronization = {
            "-1": "全部",
            "0": "实时",
            "1": "非实时",
            "2": "准实时"
        };
        $scope.authorization = {
            "-2": "全部",
            "-1": "未开通",
            "0": "已开通",
            "2": "默认开通",
            "3": "未开通"
        };

        var defaultStrategyId = '';
        //jump to rule list page of default strategy
        var goDefaultStrategy = function () {
            strategyInstanceList.get({}, function (result) {
                defaultStrategyId = result[0].id;   //set first strategy of strategy list as default strategy
                $state.go('strategyCenter', {strategyId: defaultStrategyId});
            });
        };

        $scope.backToDefaultStrategy = function () {
            strategyInstanceList.get({}, function (result) {
                defaultStrategyId = result[0].id;   //set first strategy of strategy list as default strategy
                $state.go('strategyCenter', {strategyId: $scope.udrData.strategyInstanceId});
            });
        };
        $scope.setHeight = function(){
            var _height = $(document).height()-201;
            $('.ud_add_step1').height(_height);
        }
        $scope.setHeight();
        //strategy instance ID is not defined
        if (!$stateParams.strategyInstanceId) {
            goDefaultStrategy();
        }
        //invalid strategy instance ID
        else {
            //get strategy name by strategy ID
            DefinedRule.getStrategyInstanceName({strategyInstanceId: $stateParams.strategyInstanceId}).then(
                function (response) {
                    $scope.udrData.strategyInstanceName = response.data.name;
                },
                function () {
                    goDefaultStrategy();
                }
            );
        }

        //$scope.udrData.scenarioInstanceIndex = -1;  //


        $scope.loadAll = function () {
            //获得攻略名称
            DefinedRule.getStrategyInstanceName({strategyInstanceId: $scope.udrData.strategyInstanceId}).then(function (result) {
                //console.log(result.data);
                $scope.udrData.strategyInstanceName = result.data.name;
            });

            //获取全部场景，以及对应的锦囊
            $scope.getSolutionPromise = DefinedRule.get({strategyInstanceId: $scope.udrData.strategyInstanceId}).then(
                function (response) {
                    $scope.udrData.scenarioFieldDTOs = response.data.scenarioFieldDTOs;
                },
                function (response) {
                    //TODO
                    console.error(response);
                }
            );

            // reset scenario field, solution field
            $scope.udrData.scenarioInstanceIndex = null;
            $scope.udrData.solutionInstanceIndex = null;

            // init solution list
            $scope.udrData.solutionFieldDTOs = null;

            //get rule condition list
            $scope.getRuleConditionPromise = DefinedRule.getRuleConditions({}).then(function (result) {
                $scope.udrData.ruleConditionDTOs = result.data.ruleConditionDTOs;
                for (var i = $scope.udrData.ruleConditionDTOs.length - 1; i >= 0; i--) {
                    $scope.udrData.ruleConditionDTOs[i].isChosen = false;
                    if ($scope.udrData.ruleConditionDTOs[i].authorization == -1) {
                        $scope.udrData.ruleConditionDTOs[i]._title = "规则条件对应数据服务未开通，如需开通请联系有盾商务人员";
                    };
                };
            });
        };
        $scope.searchReset = function(){
            $scope.freeStatus = '';
            $scope.openStatus = '';
            $scope.timeStatus = '';
            //$scope.udrData.sum = 0;
            $scope.udrData.istabshow = 0;
        };
        if (previousState != 'addUserDefinedRuleStep2') {
            $scope.loadAll();
            $scope.searchReset();
        }
        
        $scope.tip_solution = {invalid: false, info: ''};
        $scope.tip_ruleCondition = {invalid: false, info: ''};

        //根据用户选择的场景，更新锦囊列表
        $scope.getSolutionFieldDTOs = function () {
            //console.log($scope.udrData.scenarioInstanceIndex);
            if($scope.udrData.scenarioInstanceIndex !== null){
                $scope.tip_solution = {invalid: false, info: ''};
                $scope.udrData.solutionFieldDTOs = $scope.udrData.scenarioFieldDTOs[$scope.udrData.scenarioInstanceIndex].solutionFieldsDTOs;
            }
        };

        $scope.resetSolutionTip = function () {
            $scope.tip_solution = {invalid: false, info: ''};
        };

        $scope.cart = function(obj){
            if (obj.authorization == -1) {
                return;
            }
            obj.isChosen = !(obj.isChosen);
            if (obj.isChosen == true) {
                $scope.udrData.sum ++;
            }else{
                $scope.udrData.sum --;
            }
            $scope.countCartDetail();
            $scope.tip_ruleCondition = {invalid: false, info: ''};
            //购物车数量动画
            $('#ud_animation_1').removeClass("run-animation");
            $('#ud_animation_1').width($('#ud_animation_1').width('#ud_animation_1'));
            $('#ud_animation_1').addClass("run-animation");
        };
        $scope.cartCheck = function(e){
            e = window.event || e;
            if (e.target.checked == true) {
                $scope.udrData.sum ++;
            }else{
                $scope.udrData.sum --;
            }
            $scope.countCartDetail();
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            //购物车数量动画
            $('#ud_animation_1').removeClass("run-animation");
            $('#ud_animation_1').width($('#ud_animation_1').width('#ud_animation_1'));
            $('#ud_animation_1').addClass("run-animation");
        };
        $scope.countCartDetail = function(){
            $scope.udrData.cartDetails = [];
            for(var i=0; i<$scope.udrData.ruleConditionDTOs.length; i++){
                if($scope.udrData.ruleConditionDTOs[i].isChosen === true){
                    $scope.udrData.cartDetails.push($scope.udrData.ruleConditionDTOs[i]);
                }
            }
        };
        //筛选
        $scope.isinTime = function(e){
            var temptime = e.target.innerText,
                temp = e.target.attributes['thevalue'].value;
            $scope.timeStatus = (temp == -1?'':temp);
            $scope.istime = temptime;
            $scope.searchText = '';
        };
        $scope.isinfree = function(e){
            var temppay = e.target.innerText,
                temp = e.target.attributes['thevalue'].value;
            $scope.freeStatus = (temp == -1?'':temp);
            $scope.isfree = temppay;
            $scope.searchText = '';
        };
        $scope.isbeopen = function(e){
            var tempopen = e.target.innerText,
                temp = e.target.attributes['thevalue'].value;
            $scope.openStatus = (temp == -2?'':temp);
            $scope.isopen = tempopen;
            $scope.searchText = '';
        };
        //购物车
        $scope.showCartDetail = function(){
            $scope.udrData.istabshow = !($scope.udrData.istabshow);
            if ($scope.udrData.istabshow) {
                $(".glyphicon").removeClass('glyphicon-menu-hamburger');
                $('.glyphicon').addClass('glyphicon-remove');
            }else{
                $(".glyphicon").removeClass('glyphicon-remove');
                $('.glyphicon').addClass('glyphicon-menu-hamburger');
            }
        };
        $scope.cancelChoice = function(e){
            for(var i=0; i<$scope.udrData.ruleConditionDTOs.length; i++){
                if($scope.udrData.ruleConditionDTOs[i].id == e){
                    $scope.udrData.ruleConditionDTOs[i].isChosen = false;
                }
            }
            for(var i=0; i<$scope.udrData.cartDetails.length; i++){
                if($scope.udrData.cartDetails[i].id == e){
                    $scope.udrData.cartDetails.splice(i,1);
                    $scope.udrData.sum --;
                }
            }
        };
        //TODO: ...
        $scope.validate_solution = function () {
            if (!$scope.udrData.scenarioInstanceIndex || !$scope.udrData.solutionInstanceIndex) {

                if(!$scope.udrData.scenarioInstanceIndex && $scope.udrData.solutionInstanceIndex) {
                    $scope.tip_solution = {invalid: true, info: '请选择场景'};
                    return false;
                }
                else if ($scope.udrData.scenarioInstanceIndex && !$scope.udrData.solutionInstanceIndex){
                    $scope.tip_solution = {invalid: true, info: '请选择锦囊'};
                    return false;
                }
                else {
                    $scope.tip_solution = {invalid: true, info: '请选择场景和锦囊'};
                    return false;
                }
            } else {
                $scope.tip_solution = {invalid: false, info: ''};
                return true;
            }
        };

        $scope.validate_ruleCondition = function () {
            for (var i=0; i<$scope.udrData.ruleConditionDTOs.length; i++) {
                if ($scope.udrData.ruleConditionDTOs[i].isChosen) {
                    //$scope.tip_ruleCondition = {invalid: false, info: ''};
                    return true;
                }
            }
            //$scope.tip_ruleCondition = {invalid: true, info: '请选择规则条件！'};
            return false;
        };

        $scope.validate = function () {

            if( !$scope.validate_solution() ) {
                $scope.tip_all = $scope.tip_solution;
                //$scope.tip_all = {invalid: true, info: '请选择场景和锦囊'};
                return false;
            } else if ( !$scope.validate_ruleCondition() ) {
                $scope.tip_all = {invalid: true, info: '请选择规则条件'};
                return false;
            } else {
                $scope.tip_all = {invalid: false, info: ''};
                return true;
            }
        };

        $scope.saveAndNext = function () {

            if($scope.validate()) {

                $scope.udrData.scenarioInstanceCode = $scope.udrData.scenarioFieldDTOs[$scope.udrData.scenarioInstanceIndex].code;
                $scope.udrData.solutionInstanceCode = $scope.udrData.solutionFieldDTOs[$scope.udrData.solutionInstanceIndex].code;

                $state.go('addUserDefinedRuleStep2', {strategyInstanceId: $scope.udrData.strategyInstanceId});
            }
        };

    })

    .controller('UserDefinedRuleStep2Controller', function ($scope, $stateParams, $state, DefinedRule, previousState, udrData) {

        if (!previousState) {
            udrData.set({});
            $state.go('addUserDefinedRuleStep1', {strategyInstanceId: $stateParams.strategyInstanceId});
        }

        $scope.udrData = udrData.get();
        $scope.udrData.strategyInstanceId = $stateParams.strategyInstanceId;

        $scope.previous = function () {
            $scope.udrData.istabshow = 0;
            $state.go('addUserDefinedRuleStep1', {strategyInstanceId: $scope.udrData.strategyInstanceId});
        };

        var tmpRuleConditionList = [];
        for (var i = 0; i < $scope.udrData.ruleConditionDTOs.length; i++) {

            if ($scope.udrData.ruleConditionDTOs[i].isChosen) {
                var tmpRulConditionObj = {
                    'id': $scope.udrData.ruleConditionDTOs[i].id,
                    'code': $scope.udrData.ruleConditionDTOs[i].code,
                    'name': $scope.udrData.ruleConditionDTOs[i].name,
                    'isSynchronization': $scope.udrData.ruleConditionDTOs[i].isSynchronization,
                    'authorization': $scope.udrData.ruleConditionDTOs[i].authorization,
                    'isPay': $scope.udrData.ruleConditionDTOs[i].isPay,
                    //'ruleConditionTemplateCode': $scope.udrData.ruleConditionDTOs[i].ruleConditionTemplateCode,
                    //'status': $scope.udrData.ruleConditionDTOs[i].isChosen?'0':'1'
                    'status': $scope.udrData.ruleConditionDTOs[i].status
                };
                tmpRuleConditionList.push(tmpRulConditionObj);
            }
        }

        $scope.tip_name = {invalid: false, info: ''};
        $scope.tip_score = {invalid: false, info: ''};

        $scope.resetNameTip = function () {
            $scope.tip_name = {invalid: false, info: ''};
        };

        $scope.validate_name = function () {
            var namePattern = new RegExp("[~`!@#$%^&*()-+={}\\[\\]|\\:;\"\'<>,./?～｀！@＃$％……&＊（）—－＋＝｛｝［］｜、；：“‘《》，。？／]");

            if (!$scope.udrData.ruleName) {
                $scope.tip_name = {invalid: true, info: '请输入规则名称！'};
                return false;
            }
            else if (namePattern.test($scope.udrData.ruleName)) {
                $scope.tip_name = {invalid: true, info: '规则名称仅可包含汉字、英文字母、数字和下划线，请重新输入'};
            } else {
                $scope.tip_name = {invalid: false, info: ''};
                return true;
            }
        };

        $scope.validate_score = function () {
            var numReg = /[0-9]/;
            var tmpData = Number($scope.udrData.ruleScore);

            if (!$scope.udrData.ruleScore) {
                $scope.tip_score = {invalid: true, info: '请输入规则分值！'};
                return false;
            } else if (!(numReg.test(tmpData))) {
                $scope.tip_score = {invalid: true, info: '格式不正确，请重新输入！'};
            } else if (tmpData < 1 || tmpData > 100) {
                $scope.tip_score = {invalid: true, info: '分值需在1-100区间内，请重新输入！'};
            } else{
                $scope.tip_score = {invalid: false, info: ''};
                return true;
            }
        };

        $scope.saveAndFinish = function () {

            $scope.validate_name();
            $scope.validate_score();

            if( !$scope.tip_name.invalid && !$scope.tip_score.invalid ) {

                var toSaveUserDefinedRule = {
                    'strategyInstanceId': $scope.udrData.strategyInstanceId,
                    'scenarioInstanceCode': $scope.udrData.scenarioInstanceCode,
                    'solutionInstanceCode': $scope.udrData.solutionInstanceCode,
                    'ruleName': $scope.udrData.ruleName,
                    'ruleScore': Number($scope.udrData.ruleScore),
                    'ruleDescription': $scope.udrData.ruleDescription,
                    'ruleConditionDTOs': tmpRuleConditionList
                };

                $scope.savePromise = DefinedRule.save(toSaveUserDefinedRule).then(
                    function (result) {
                        $scope.udrData.ruleInstanceCode = result.data;
                        $state.go('addUserDefinedRuleStep3', {strategyInstanceId: $stateParams.strategyInstanceId});
                    },
                    function (result) {
                        //TODO
                        console.log(result);
                    });
            }

        };
    })

    .controller('UserDefinedRuleStep3Controller', function ($scope, $stateParams, $state, DefinedRule, previousState, udrData) {

        //TODO
        if (!previousState) {
            udrData.set({});
            $state.go('addUserDefinedRuleStep1', {strategyInstanceId: $stateParams.strategyInstanceId});
        }
        $scope.udrData = udrData.get();
        udrData.set({});

        $scope.goRuleList = function () {
            $state.go('ruleCenter', {strategyId: $stateParams.strategyInstanceId});
        };
    });
    