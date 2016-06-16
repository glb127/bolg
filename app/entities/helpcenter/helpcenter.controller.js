'use strict';

angular.module('cloudxWebApp')
    .controller('HelpCenterController', function ($scope, $state, $stateParams, $location, $anchorScroll) {
        $scope.nones = ['攻略', '攻略ID', '攻略决策方式', '规则条件', '规则', '规则ID',
            '规则分值', '数据服务', '场景', '锦囊', '事件', '风险事件', '风险处理策略',
            '风险处理结果', '风险等级'];

        $scope.goto = function (id) {
            $location.hash(id);
            $anchorScroll();
        }
        if(!$stateParams.anchor){
            $stateParams.anchor = "data_security";
        }
        $scope.goto($stateParams.anchor);
    });