'use strict';

angular.module('cloudxWebApp')
    .controller('LoginController', function($rootScope, $scope, $state, $timeout, Auth, CaptchaService, $location, $cookies, $http) {
        $scope.user = {};
        $scope.errors = {};
        $scope.tip = '';
        $scope.captchaFlag = 0; //0:do not validate; 1: sucess; 2: failure
        $scope.rememberMe = true;
        $scope.username = $cookies.get('username'); //get user name from cookie

        var checkcodeIcon = $('#checkcodeIcon');
        var responseMessage = '';

        var handler = function(captchaObj) {
            $('.login_btn').click(function(e) {
                $scope.tip = '';
                var validate = captchaObj.getValidate();
                if (!validate) {
                    $scope.tip = '请先完成验证！';
                    return;
                }

                // var gt_server_status_code = "1";

                $http.post('/api/verifyLogin', {
                    geetestChallenge: validate.geetest_challenge,
                    geetestValidate: validate.geetest_validate,
                    geetestSeccode: validate.geetest_seccode
                }).success(function(data) {
                    if (data && (data.status === 'success')) {
                        $scope.login();
                    } else {
                        $scope.tip = '二次验证失败！';
                        captchaObj.refresh();
                    }
                });
            });
            captchaObj.appendTo('#captcha');
        };

        $scope.getCaptcha = function() {
            $http.get('/api/startCaptcha', { params: { userId: $scope.username } }).success(function(data) {
                initGeetest({
                    gt: data.gt,
                    challenge: data.challenge,
                    product: 'float',
                    offline: !data.success
                }, handler);
            });
        };

        $scope.getCaptcha();

        $timeout(function() { angular.element('[ng-model="username"]').focus(); });

        //TODO split validation into username&password-validate and captcha-validate

        $scope.login = function() {

            if ($scope.rememberMe) {
                $cookies.put('username', $scope.username);
            } else {
                $cookies.remove('username');
            }

            //event.preventDefault();
            Auth.login({
                username: $scope.username,
                password: $scope.password,
                captcha: $scope.captchaText,
                rememberMe: $scope.rememberMe
            }).then(function(data) {
                $scope.authenticationError = false;
                /*if ($rootScope.previousStateName === 'register') {
                    $state.go('home');
                } else {
                    $rootScope.back();
                }*/
                $state.go('strategyCenter');
            }).catch(function(response) {
                responseMessage = response.data.message;
                $scope.tip = '';
                $scope.captchaFlag = 1;

                switch (responseMessage) {
                    case 'Authentication Failed: captcha error':
                        $scope.captchaFlag = 2; //wrong captcha
                        break;
                    case 'Authentication failed':
                        $scope.captchaFlag = 1; //right captcha, wrong username or password
                        $scope.tip = '用户名或密码错误！';
                        break;
                    case 'Authentication Failed: checking':
                        $scope.tip = '商户状态审核中。';
                        break;
                    case 'Authentication Failed: logout':
                        $scope.tip = '商户状态注销。';
                        break;
                    case 'Authentication Failed: unSubmit':
                        $scope.tip = '商户状态未提交。';
                        break;
                    case 'Authentication Failed: freeze':
                        $scope.tip = '商户状态冻结。';
                        break;
                    case 'Authentication Failed: checkNotPass':
                        $scope.tip = '商户状态审核不通过。';
                        break;
                    case 'Authentication Failed: superOverDraft':
                        $scope.tip = '商户状态超透支。';
                        break;
                    default:
                        $scope.captchaFlag = 0; //unknown or undefinded status
                        $scope.tip = '登录失败！';
                }

                $scope.authenticationError = true;
                $('#captcha').html('');
                $('.login_btn').unbind('click');
                $scope.getCaptcha();
            });
        };

    });
