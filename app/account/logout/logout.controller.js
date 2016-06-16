'use strict';

angular.module('cloudxWebApp')
    .controller('LogoutController', function (Auth) {
        Auth.logout();
    });
