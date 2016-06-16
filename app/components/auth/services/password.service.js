'use strict';

angular.module('cloudxWebApp')
    .factory('Password', function ($resource) {
        return $resource('api/account/change_password', {}, {
        });
    });

angular.module('cloudxWebApp')
    .factory('PasswordResetInit', function ($resource) {
        return $resource('api/account/reset_password/init', {}, {
        });
    });

angular.module('cloudxWebApp')
    .factory('PasswordResetFinish', function ($resource) {
        return $resource('api/account/reset_password/finish', {}, {
        });
    });

angular.module('cloudxWebApp')
    .factory('PasswordValidate', function($http){
        return {
            validatePassword: function(pwd){
                return $http.post('api/user/passWord', pwd)
                    .then(function(response){
                        return response;
                    });

            }
        };
    });

