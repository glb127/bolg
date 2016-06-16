'use strict';

angular.module('cloudxWebApp')
    .directive('switch', function(){
        /**
         * @version 2.1.3
         * @date November 16, 2015
         *
         * @description
         * change style
         */
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            template: function(element, attrs) {
                var html = '';
                html += '<span class="switch" ng-class="{checked: ' + attrs.ngModel + '}">';
                html += attrs.on ? '<span class="on"><span class="text">'+attrs.on+'</span></span>' : '';
                html += attrs.off ? '<span class="off"><span class="text">'+attrs.off + '</span></span>' : ' ';
                html += '<span class="xs"></span>';
                html += '</span>';

                return html;
            }
        };

        // BACK ver 1.0.0
        /*return {
            restrict: 'AE'
            , replace: true
            , transclude: true
            , template: function(element, attrs) {
                var html = '';
                html += '<span class="switch" ng-class="{checked: ' + attrs.ngModel + '}">';
                html += '<span class="xs">';
                html += attrs.on ? '<span class="on">'+attrs.on+'</span>' : '';
                html += attrs.off ? '<span class="off">'+attrs.off + '</span>' : ' ';
                html += '</span>';
                html += '</span>';

                return html;
            }
        }*/
    });
