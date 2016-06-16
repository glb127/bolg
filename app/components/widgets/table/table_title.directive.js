// 'use strict';

// angular.module('cloudxWebApp')
//     .directive('udTableTitle', ["$timeout", function($timeout) {
//         return {
//             restrict : 'EA',
//             scope: {},
//             transclude: true,
//             template : '<div style="position:relative;" ng-transclude></div>',
//             link: function(scope, element, attrs) {
//                 var $thead = element.children().children().find("thead"),
//                     $tbody = element.children().children().find("tbody");

//                 element.parent().scroll(scrollFixed);
//                 init();

//                 function init() {
//                     $thead.addClass("ud-table-title-fixed")
//                     $timeout(function(){
//                         resizeFixed();
//                     },300);
//                  }
//                  function resizeFixed() {
//                     var firstTR= $tbody.find("td").slice(0,$thead.find("th").length-1);
//                     firstTR.each(function(index) {
//                        $(this).css("width",$thead.find("th").eq(index).css("width"));
//                     });
//                  }
//                  function scrollFixed(data) {
//                     $thead.css({'top':$(this).scrollTop()+'px'});
//                  }
                
//             }
//         }
//     }]);
//     
'use strict';

angular.module('cloudxWebApp')
    .directive('udTableTitle', ["$timeout", function($timeout) {
        return {
            restrict : 'EA',
            scope: {},
            transclude: true,
            template : '<div style="position:relative;" ng-transclude></div>',
            link: function(scope, element, attrs) {
                var $this = element.children().children(),
                    $t_fixed;

                $(window).resize(resizeFixed);
                element.parent().scroll(scrollFixed);
                init();

                function init() {
                    $t_fixed = $this.clone();
                    $t_fixed.find("tbody").remove().end().addClass("ud-table-title-fixed")
                    element.children().prepend($t_fixed);
                    $t_fixed.find("th .dropdown-toggle").each(function(index) {
                        
                        $(this).click(function(){
                            $timeout(function(){
                                $this.find("th .dropdown-toggle").eq(index).trigger("click");
                            },10);
                        });
                    });
                    $timeout(function(){
                        resizeFixed();
                    },300);
                 }
                 function resizeFixed() {
                    $t_fixed.find("th").each(function(index) {
                       $(this).css("width",$this.find("th").eq(index).css("width"));
                    });
                 }
                 function scrollFixed(data) {
                    $t_fixed.css({'top':$(this).scrollTop()+'px'});
                    $this.find('.dropdown-menu').css({'top':$(this).scrollTop()+16+'px'});
                    $this.find('.dropdown-endline.three_child').css({'top':$(this).scrollTop()+126+'px'});
                   
                 }
                
            }
        }
    }]);