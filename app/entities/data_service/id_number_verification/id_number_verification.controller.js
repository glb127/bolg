'use strict';
angular.module('cloudxWebApp')
    .controller('IdNumberVerificationController', function ($scope,  $log, RealNameAuthentication) {
        $scope.realNameAuthentications = {};
        $scope.success = false;

        $scope.init = function () {
            $scope.msgs = '';
            $scope.nametip='';
            $scope.idtip='';
        };

        $scope.getMsg = function (realNameAuthentication) {
            var re=/^([\u4E00-\u9FA5])([\u4E00-\u9FA5]|\u00b7)*([\u4E00-\u9FA5])$/;  //姓名格式
            var isIDCard1=/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;    //15位身份证
            var isIDCard2=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;  //18位身份证
            var name = realNameAuthentication.name;
            var identity = realNameAuthentication.identity;
            if(name === null || name === ''){
                $scope.nametip='姓名不能为空';
                $scope.success = false;
                return;
            }else if(!re.test(name)){
                $scope.nametip='请输入正确的姓名格式';
                $scope.success = false;
                return;
            }
            if(identity === null || identity === ''){
                $scope.idtip='身份证号不能为空';
                $scope.success = false;
                return;
            }else if(!(isIDCard1.test(identity) || isIDCard2.test(identity))){
                $scope.idtip='身份证号格式不正确';
                $scope.success = false;
                return;
            }
            RealNameAuthentication.query(realNameAuthentication, function (result) {
                if (result.res == 1) {
                    $scope.msgs = '一致！';
                    $scope.success = true;
                } else if (result.res == 2) {
                    $scope.msgs = '不一致！';
                    $scope.success = false;
                } else if (result.res == 3) {
                    $scope.msgs = '无此证件号！';
                    $scope.success = false;
                } else {
                    $scope.msgs = '认证失败！';
                    $scope.success = false;
                }
            }, function (error) {
                if (error.status == 403) {
                    $scope.error = '您尚未开通此服务，请联系有盾客服进行咨询，谢谢！';
                    $scope.disable = true;
                }
            });
        };
    });
