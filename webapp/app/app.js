'use strict';

angular.module('cloudxWebApp', ['LocalStorageModule', 'tmh.dynamicLocale', 'pascalprecht.translate','template/popover/popover-template-arrow.html',
    'ngResource', 'ui.router', 'ngCookies', 'ngCacheBuster',"ui.bootstrap", 'infinite-scroll', 'dibari.angular-ellipsis',
    'cgBusy', 'focusOn', 'mgcrea.ngStrap.scrollspy', 'mgcrea.ngStrap.affix', 'self.bootstrap.popover','self.bootstrap.tooltipself','template/popover/popover-template-self.html',
    'localytics.directives','dragularModule'])
    .run(function ($rootScope, $location, $window, $http, $state, $translate, Language, Auth, Principal, ENV, VERSION) {
        $rootScope.isAuthenticated = Principal.isAuthenticated;
        $rootScope.loginFlag = false;

        $rootScope.ENV = ENV;
        $rootScope.VERSION = VERSION;
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (Principal.isIdentityResolved()) {
                Auth.authorize();
            }

            // Update the language
            Language.getCurrent().then(function (language) {
                $translate.use(language);
            });

            $rootScope.loginFlag = !(toState.name == 'login');
              
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            var titleKey = 'global.title';

            $rootScope.previousStateName = fromState.name;
            $rootScope.previousStateParams = fromParams;

            // Set the page title key to the one configured in state or use default one
            if (toState.data.pageTitle) {
                titleKey = toState.data.pageTitle;
            }
            $translate(titleKey).then(function (title) {
                // Change window title with translated one
                $window.document.title = title;
            });
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log('stateChangeError');
            console.log(toState, toParams, fromState, fromParams, error);
            if(!error){
                return;
            }
            if (error.status == 401) {
                console.log("401 detected. Redirecting...");
                Auth.authorize();
            }
        });
        $rootScope.back = function () {
            // If previous state is 'activate' or do not exist go to 'home'
            if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
                $state.go('strategyCenter');
            } else {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        };
    })

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, httpRequestInterceptorCacheBusterProvider) {

        //enable CSRF
        $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

        $urlRouterProvider.otherwise('/strategy');
        $stateProvider.state('site', {
            params: {'isNarrow': false},
            'abstract': true,
            views: {
                'navbarside@': {
                    templateUrl: 'app/components/navbar/navbarside.html',
                    controller: 'NavbarsideController'
                },
                'navbar@': {
                    templateUrl: 'app/components/navbar/navbar.html',
                    controller: 'NavbarController'
                },
                'footer@': {
                    templateUrl: 'app/components/navbar/footer.html'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ]
            }
        })
            .state('login', {
                url: '/login',
                params: {isNarrow: null},
                views: {
                    'login@': {
                        templateUrl: 'app/account/login/login.html',
                        controller: 'LoginController'
                    }
                },
                data: {
                    roles: [],
                    pageTitle: '登录'
                },
                resolve: {
                    authorize: ['Auth',
                        function (Auth) {
                            return Auth.authorize();
                        }
                    ]
                }
            });

        $httpProvider.interceptors.push('authExpiredInterceptor');

        // Initialize angular-translate
        // $translateProvider.useLoader('$translatePartialLoader', {
        //     urlTemplate: 'i18n/{lang}/{part}.json'
        // });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy('escaped');

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage();
        tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');

    })
    .factory('authExpiredInterceptor', function ($rootScope, $q, $injector, localStorageService) {
        return {
            responseError: function (response) {
                // If we have an unauthorized request we redirect to the login page
                // Don't do this check on the account API to avoid infinite loop
                if (response.status == 401 && response.data.path !== undefined && response.data.path.indexOf("/api/account") == -1) {
                    var Auth = $injector.get('Auth');
                    var $state = $injector.get('$state');
                    var to = $rootScope.toState;
                    var params = $rootScope.toStateParams;
                    Auth.logout();
                    $rootScope.returnToState = to;
                    $rootScope.returnToStateParams = params;
                    $state.go('login');
                }
                return $q.reject(response);
            }
        };
    })
    .config(function($affixProvider) {
    	  angular.extend($affixProvider.defaults, {
    	    offsetTop: 100
    	  });
    	});

//TODO refactor this code another file later
angular.module('cloudxWebApp').value('cgBusyDefaults', {
    //message: '请稍候...',
    backdrop: false,
    //delay: 300,
    minDuration: 700,
    templateUrl: 'app/components/widgets/loading_template.html'
});
