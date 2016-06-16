'use strict';

angular.module('cloudxWebApp')
    .controller('RiskEventDetailController', function ($scope, $state, $stateParams, NameListControl, openRisk, RiskEventDetail) {
        $scope.dealSolutions = [
            {'code': '', 'name': '全部'},
            {'code': '9999', 'name': '阻止'},
            {'code': '0000', 'name': '放行'}
        ];

        $scope.platforms = [
            {'code':'PL4333', 'name':'iOS'},
            {'code':'PL7397', 'name':'android'},
            {'code':'PL6811', 'name':'web'}
        ];

        var riskLevelMap = {
            4: '极高风险',
            3: '高风险',
            2: '中风险',
            1: '低风险',
            0: '极低风险'
        };

        $scope.dealSolutions = [
            {'code': '', 'name': '全部'},
            {'code': '9999', 'name': '阻止'},
            {'code': '0000', 'name': '放行'}
        ];

        $scope.riskEvent = {};

        //翻译处理结果，翻译风险等级
        $scope.translateDealSolutionsAndRiskLevels = function(item) {
            if (!!item.riskEventDetailsDTO) {
                //retCode translate
                for (var j = 0; j < $scope.dealSolutions.length; j++) {
                    if (item.riskEventDetailsDTO.retCode == $scope.dealSolutions[j].code) {
                        item.riskEventDetailsDTO.retCode = $scope.dealSolutions[j].name;
                        break;
                    }
                }

                //platforms translate
                for (var j = 0; j < $scope.platforms.length; j++) {
                    if (item.riskEventDetailsDTO.platform == $scope.platforms[j].code) {
                        item.riskEventDetailsDTO.platform = $scope.platforms[j].name;
                    }
                }

                item.riskEventDetailsDTO.riskLevel = riskLevelMap[item.riskEventDetailsDTO.riskLevel];
            }

        };

        /*$scope.items = openRisk.query({riskEventId: $stateParams.eventId}, function (result, headers) {
         $scope.translateDealSolutionsAndRiskLevels(result);
         return result;
         });*/

        $scope.openRiskEventControlWindow = function () {
            $state.go('riskEventDetailDeal', {id: $stateParams.id, eventId: $stateParams.eventId});
        };

        // jump to event log
        $scope.relate = function (businessData) {
            if (businessData.relationship) {
                $state.go('eventLog',
                    {
                        queryCondition:
                        {
                            'keywordType': businessData.dimension,
                            'encryptKeyword': businessData.secret,
                            'keyword': businessData.value,
                            'type': 'encrypt'
                        }
                    });
            }
        };

        $scope.relateUserId = function (userId) {
            $state.go('eventLog',
                {
                    queryCondition: {
                        'keywordType': 'user_id',
                        'encryptKeyword': '',
                        'keyword': userId,
                        'type': 'keyword'
                    }
                });

        };

        $scope.relateTransactionId = function (transId) {
            $state.go('eventLog',
                {
                    queryCondition: {
                        'keywordType': 'trans_id',
                        'encryptKeyword': '',
                        'keyword': transId,
                        'type': 'keyword'
                    }
                });
        };

        $scope.load = function () {
            RiskEventDetail.get({'event-id': $stateParams.eventId}).then(function(result) {
                $scope.items = result.data;
                //console.log($scope.items);

                $scope.translateDealSolutionsAndRiskLevels($scope.items);
            });
        };
        $scope.load();
    })

    .controller('RiskEventDealController', function ($scope, $stateParams, NameListControl, $state, UpdateRemark) {//风险人工处理Controller

        $scope.nameListControls = [];
        $scope.removeDuplicateValidities = [];
        $scope.typeList = [
            {'name': '黑名单', 'code':'0'},
            {'name': '灰名单', 'code':'1'},
            {'name': '白名单', 'code':'2'}
        ];
        var eventId = $stateParams.eventId;
        var id = $stateParams.id;

        $scope.validities = ['30', '60', '120', '180', '永久', '自定义'];
        var selected = $scope.selected = [];

        $scope.remark = '有风险';  //默认为有风险

        $scope.tip_list = {invalid: true, info: ''};   // tip of name list

        //去重
        $scope.removeDuplicate = function(val){
            for(var j=1;j<val.length;j++){
                var key=val[0];
                if(key==val[j]){
                    val.splice(j,1);
                }
            }
            return val;
        };

        $scope.removeDuplicateFromValidities = function(nameListControl){
            if((nameListControl.validity!=undefined)&&(nameListControl.validity!='')&&(nameListControl.validity!=null)){
                var j=0;
                for(var i=0;i<$scope.validities.length;i++){
                    //构建一个新的包含原始数据以及默认数据的数组并删除重复项
                    $scope.removeDuplicateValidities[++j]=$scope.validities[i];
                    $scope.removeDuplicateValidities[0]=nameListControl.validity;
                }
                $scope.removeDuplicate($scope.removeDuplicateValidities);
            }
            else{
                $scope.removeDuplicateValidities=$scope.validities;
            }
        };

        NameListControl.query({eventId: eventId}, function (result) {
            for (var i = 0; i < result.length; i++) {
                $scope.nameListControls.push(result[i]);
            }
            $scope.Validities=[];
            for(var j=0;j<$scope.nameListControls.length;j++){
                $scope.removeDuplicateFromValidities($scope.nameListControls[j]);
                $scope.Validities.push($scope.removeDuplicateValidities);
                $scope.removeDuplicateValidities=[];
            }
        });

        //获取选中项
        $scope.updateSelection = function ($event, id) {
            var checkbox = $event.target;
            var action = (checkbox.checked ? 'add' : 'remove');
            if ((action == 'add') && (selected.indexOf(id) == -1)) {
                id.type = $scope.type;
                selected.push(id);
            }
            if (action == 'remove' && selected.indexOf(id) != -1) {
                selected.splice(selected.indexOf(id), 1);
            }
        };

        function goEventDetail() {
            if($stateParams.prevState == 'eventLogDetail') {
                $state.go($stateParams.prevState, {id: id});
            } else {
                $state.go('riskEventDetail', {id: id, eventId: eventId});
            }
        }

        //选中项保存到名单中
        $scope.saveNameListControl = function () {
            for (var i = 0; i < selected.length; i++) {
                selected[i].type = $scope.type;
                if (selected[i].validity == '自定义') {
                    selected[i].validity = selected[i].validityDefined+'天';
                }
                else{
                    selected[i].validity = selected[i].validity+'天';
                }
            }

            /*// 判断是否勾选名单列表
             if ( !!selected[0] ) {
             $scope.tip_list = {invalid: false, info: ''};   // tip of name list

             NameListControl.save(selected, function (result) {});

             UpdateRemark.update({eventId: eventId, remark: $scope.remark}, function (result) {
             //$uibModalInstance.close();
             });
             goEventDetail();
             } else {
             $scope.tip_list = {invalid: true, info: '请勾选名单列表'};   // tip of name list
             }*/

            NameListControl.save(selected, function (result) {});

            UpdateRemark.update({eventId: eventId, remark: $scope.remark}, function (result) {
                //$uibModalInstance.close();
            });
            goEventDetail();
        };

        $scope.cancel = function () {
            goEventDetail();
        };
    });
