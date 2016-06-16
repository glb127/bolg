'use strict';

angular.module('cloudxWebApp')

    //validate old password
    /*.controller('PasswordStep1Controller', function ($scope, Auth, Principal, $state, PasswordValidate) {

        $scope.init = function () {
            $scope.tip = {invalid: true, info: ''};
        };
        $scope.init();

        $scope.validatePassword = function() {
            if(!$scope.password) {
                $scope.tip = {invalid: true, info: '请输入您的密码'};

            } else {
                $scope.tip = {invalid: false, info: ''};
                PasswordValidate.validatePassword({'passWord': $scope.password}).then(
                    function (response) {
                        if(response.data === 'password correct') {
                            $scope.tip = {invalid: false, info: '密码正确'};
                            $state.go('passwordStep2');
                        } else {
                            $scope.tip = {invalid: true, info: '密码不正确，请重新输入'};
                        }
                    }).catch(function () {
                        console.log('err');
                    },
                    function() {
                        console.error('err');
                    });
            }
        };

    })*/

    // change password
    .controller('PasswordStep1Controller', function ($scope, $http, $state, $timeout, Auth, Principal) {
        Principal.identity().then(function(account) {
            $scope.account = account;
        });

        $scope.init = function () {
            $scope.success = null;
            $scope.error = null;
            $scope.doNotMatch = null;
        };
        $scope.init();

        $scope.logout = function () {
            Auth.logout();
            $state.go('login');
        };

        $scope.changePassword = function () {
            if ($scope.password !== $scope.confirmPassword) {
                $scope.doNotMatch = 'ERROR';
            } else {
                $scope.doNotMatch = null;
                $http.post('api/account/change_password', {
                    oldPassword: $scope.oldPassword,
                    newPassword: $scope.password
                }).then(function() {
                    $scope.error = null;
                    $scope.success = 'OK';
                    $timeout(function() {
                        $scope.logout();
                    }, 2500);
                }).catch(function() {
                    $scope.success = null;
                    $scope.error = 'ERROR';
                });
            }
        };
    });
