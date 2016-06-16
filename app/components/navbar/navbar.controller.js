'use strict';

angular.module('cloudxWebApp')
    .controller('NavbarController', function ($scope, $compile, $location, $state, $stateParams, $http, $timeout, Auth,
                                              Principal, Balance, strategyInstanceList, NewBalance, BalanceTip,
                                              Message, UserInformation) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.strategyList = true;
        $scope.strategyInstanceList = [];
        $scope.dataServiceMenu = true;
        $scope.strategyList_narrow = true;
        $scope.dataServiceMenu_narrow = true;
        $scope.userInfoData = {};
        $scope.popoverIsOpen = false;
        $scope.delayFade;

        angular.element(".ud_navbar_header").mouseenter(function() {
            $timeout.cancel($scope.delayFade);
            $scope.$apply(function() {
                $scope.popoverIsOpen = true;
            });
            $timeout(function() {
                angular.element(".popover").one("mouseenter", function() {
                    $timeout.cancel($scope.delayFade);
                });
                angular.element(".popover").one("mouseleave", function() {
                    $scope.delayFade = $timeout(function() {
                        $scope.$apply(function() {
                            $scope.popoverIsOpen = false;
                        });
                    }, 200);
                });
            }, 100);
        });

        angular.element(".ud_navbar_header").mouseleave(function() {
            $scope.delayFade = $timeout(function() {
                $scope.$apply(function() {
                    $scope.popoverIsOpen = false;
                });
            }, 200);
        });

        //消息类型：message code: message content
        $scope.messageType = {
            1: '数据服务上线',
            2: '数据服务维护',
            3: '数据服务下线',
            4: '数据服务变更',
            5: '风控系统升级',
            6: '风控系统维护'
        };

        $scope.getUserInformation = function() {
            UserInformation.get().then(function(result) {
                for (var key in result) {
                    $scope.userInfoData[key] = result[key];
                }
            });
        };
        $scope.getUserInformation();

        var title = angular.element('#title_show');

        $scope.logout = function () {
            Auth.logout();
            $state.go('login');
        };

        Principal.identity().then(function (account) {
            $scope.account = account;
        });

        $scope.userInfoPopover = {
            templateUrl: 'userInfoTemplate.html'
        };

        $scope.messageCenterPopover = {
            templateUrl: 'messageCenterTemplate.html'
        };

        $scope.getBalance = function () {
            Balance.get({}, function (result) {
                $scope.userInfo = result;
            });
        };
        // 验证用户是否欠费
        $scope.validateBalance = function() {
            if (BalanceTip.show()) {
                NewBalance.get({}, function (result) {
                    if (result.balance + result.donateBalance < 0) {
                        $scope.tip_balance = {invalid: true, info: '您的账户已欠费，请尽快缴费，以免影响您业务的正常运行。'};
                    } else {
                        //$scope.tip_balance = {invalid: true, info: '没有欠费哦~~'};
                        $scope.tip_balance = {invalid: false, info: ''};
                    }
                });
            }
        }
        $scope.getMessage = function () {
            Message.get({}, function (result) {
                $scope.messages = result;
            });
        };
        $scope.updateBalance = function () {
            NewBalance.get({}, function (result) {
                $scope.userInfo.balance = result.balance;
                $scope.userInfo.donateBalance = result.donateBalance;
            });
        };
        $scope.getPrincipal = function () {
            Principal.identity().then(function (account) {
                $scope.account = account;
            });
        }
            
        $scope.init = function () {
            $scope.getMessage();
            $scope.validateBalance();
            $scope.getBalance();
            $scope.getPrincipal();
        }
        $scope.goPassword = function () {
            var pop = angular.element(".popover");
            pop.remove();
            $state.go('password');
        };

        //点击popover以外区域关闭popover（有bug）
        $scope.popupListener = function () {
            angular.element('body').bind('click', function (eve) {

                var pophead = angular.element("#ud_navbar_headerPop");
                var pop = angular.element("#ud_navbar_headerPop .popover");
                var popScope = pop.scope();
                if (!popScope) {
                    return;
                }

                var target = eve.target;
                var isClickPop = pop.is(target) || pop.has(target).length > 0 || pophead.is(target) || pophead.has(target).length > 0;
                // 点击header&&popover区域时，不处理
                if (!isClickPop) {
                    pop.remove();
                }
            });
        };

        //
        $scope.secmenuListener = function () {
            angular.element('#strategyCenter').bind('mouseleave', function (eve) {
                var secmenu = angular.element('.ud_navmenu_sec');
                var secmenuScope = secmenu.scope();
                if (!secmenuScope) {
                    return;
                }

                var target = eve.toElement;
                var isIn = secmenu.is(target);
                if (!isIn) {
                    $scope.strategyList = true;
                }
            })
        };

        $scope.expand = function () {
            $('.narrow').hide();
            $('.wide').show();
            $('.rm_right_header').css('left', '200px');
            $('.rm_right_content').css('left', '200px');
        };
        // $scope.expand(); //default as wide side-navbar

        $scope.collapse = function () {
            $('.wide').hide();
            $('.narrow').show();
            $('.rm_right_header').css('left', '80px');
            $('.rm_right_content').css('left', '80px');
        };

        $('.rm_right_header').css('box-shadow', '0 0 7px #999');
        //$('.rm_right_content').css('box-shadow', '0 0 7px #333');

        if ($stateParams.isNarrow === 'true') {
            $scope.collapse();
        }
        else {
            $scope.expand(); //default as wide side-navbar
        }


        // 
        // 关闭欠费提示
        $scope.ignoreTip = function () {
            BalanceTip.close(true);
            $scope.tip_balance = {invalid: false, info: '我不会显示在页面里呢'};
        };

        $scope.showMessageBox = function () {
            angular.element('#messageBox').css('display','block');
        };

        $scope.hideMessageBox = function () {
            angular.element('#messageBox').css('display','none');
        };
        //商户将消息设置为已读
        $scope.setRead = function (messageId) {
            Message.update({'messageId': messageId}, function (result) {
                //设置成功，刷新消息
                Message.get({}, function (result) {
                    $scope.messages = result;
                });
            })
        };
    })
;
