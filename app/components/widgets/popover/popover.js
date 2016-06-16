'use strict';

angular.module('self.bootstrap.tooltipself',[])
/**
 * The $tooltip service creates tooltip- and popover-like directives as well as
 * houses global options for them.
 */
    .provider('$tooltipself', function() {
        // The default options tooltip and popover.
        var defaultOptions = {
            placement: 'top',
            animation: true,
            popupDelay: 0,
            hideDelay: 0,
            useContentExp: false
        };

        // Default hide triggers for each show trigger
        var triggerMap = {
            'mouseenter': 'mouseleave',
            'click': '',
            'focus': 'blur',
            'none': ''
        };


        // The options specified to the provider globally.
        var globalOptions = {};

        /**
         * `options({})` allows global configuration of all tooltips in the
         * application.
         *
         *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
         */
        this.options = function(value) {
            angular.extend(globalOptions, value);
        };

        /**
         * This allows you to extend the set of trigger mappings available. E.g.:
         *
         *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
         */
        this.setTriggers = function setTriggers(triggers) {
            angular.extend(triggerMap, triggers);
        };

        /**
         * This is a helper function for translating camel-case to snake-case.
         */
        function snake_case(name) {
            var regexp = /[A-Z]/g;
            var separator = '-';
            return name.replace(regexp, function(letter, pos) {
                return (pos ? separator : '') + letter.toLowerCase();
            });
        }

        /**
         * Returns the actual instance of the $tooltip service.
         * TODO support multiple triggers
         */
        this.$get = ['$window', '$compile', '$timeout', '$document', '$position', '$interpolate', '$rootScope', '$parse', function($window, $compile, $timeout, $document, $position, $interpolate, $rootScope, $parse) {
            return function $tooltipself(type, prefix, defaultTriggerShow, options) {
                options = angular.extend({}, defaultOptions, globalOptions, options);
                /**
                 * Returns an object of show and hide triggers.
                 *
                 * If a trigger is supplied,
                 * it is used to show the tooltip; otherwise, it will use the `trigger`
                 * option passed to the `$tooltipProvider.options` method; else it will
                 * default to the trigger supplied to this directive factory.
                 *
                 * The hide trigger is based on the show trigger. If the `trigger` option
                 * was passed to the `$tooltipProvider.options` method, it will use the
                 * mapped trigger from `triggerMap` or the passed trigger if the map is
                 * undefined; otherwise, it uses the `triggerMap` value of the show
                 * trigger; else it will just use the show trigger.
                 */
                function getTriggers(trigger) {
                    var show = (trigger || options.trigger || defaultTriggerShow).split(' ');

                    var hide = show.map(function() {
                        return  null;
                    });
                    return {
                        show: show,
                        hide: hide
                    };
                }

                var directiveName = snake_case(type);

                var startSym = $interpolate.startSymbol();
                var endSym = $interpolate.endSymbol();
                var template =
                    '<div '+ directiveName +'-popup '+
                    'title="'+startSym+'title'+endSym+'" '+
                    (options.useContentExp ?
                        'content-exp="contentExp()" ' :
                    'content="'+startSym+'content'+endSym+'" ') +
                    'placement="'+startSym+'placement'+endSym+'" '+
                    'popup-class="'+startSym+'popupClass'+endSym+'" '+
                    'animation="animation" '+
                    'is-open="isOpen"'+
                    'origin-scope="origScope" '+
                    '>'+
                    '</div>';

                return {
                    restrict: 'EA',
                    compile: function(tElem, tAttrs) {
                        var tooltipLinker = $compile( template );
                        if(tAttrs.popoverSelf){
                            tAttrs.popover = tAttrs.popoverSelf;
                        }
                        if(tAttrs.popoverTemplateSelf){
                            tAttrs.popoverTemplate = tAttrs.popoverTemplateSelf;
                        }

                        if(tAttrs.popoverTemplateArrow){
                            tAttrs.popoverTemplate = tAttrs.popoverTemplateArrow;
                        }
                        return function link(scope, element, attrs, tooltipCtrl, $window,  $document) {
                            var tooltip;
                            var tooltipLinkedScope;
                            var transitionTimeout;
                            var popupTimeout;
                            var positionTimeout;
                            var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
                            var triggers = getTriggers(undefined);
                            var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
                            var ttScope = scope.$new(true);
                            var repositionScheduled = false;
                            var isOpenExp = angular.isDefined(attrs[prefix + 'IsOpen']) ? $parse(attrs[prefix + 'IsOpen']) : false;
                            var $element = attrs.$$element[0]

                            var positionTooltip = function() {
                                if (!tooltip) { return; }

                                if (!positionTimeout) {
                                    positionTimeout = $timeout(function() {
                                        // Reset the positioning and box size for correct width and height values.
                                        if(tAttrs.popoverTemplateSelf){
                                            tooltip.css({ top: 0, left: 0, width: 'auto', height: 'auto' });

                                            var ttBox = $position.position(tooltip);
                                            var ttCss = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                                            ttCss.top += 'px';
                                            ttCss.left = '0px';

                                            ttCss.width = ttBox.width + 'px';
                                            ttCss.height = ttBox.height + 'px';

                                            // Now set the calculated positioning and size.
                                            tooltip.css(ttCss);
                                        }

                                        if(tAttrs.popoverTemplateArrow){
                                            tooltip.css({ top: 0, left: 0, width: 'auto', height: 'auto' });

                                            var ttBox1 = $position.position(tooltip);
                                            var ttCssPrep = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                                            var ttElem = $position.position(element);
                                            var ttCss1 = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);

                                            //get the panel's width
                                            var outer = angular.element('.sv_panel');
                                            var ttOuter = $position.position(outer);

                                            //
                                            ttCss1.top = ttCss1.top - 12;
                                            ttCssPrep.left = ttCss1.left + ttBox1.width/2  - ttElem.width/2;

                                            ttCss1.top += 'px';
                                            ttCss1.width = ttBox1.width + 'px';
                                            ttCss1.height = ttBox1.height + 'px';


                                            if(ttCssPrep.left+ttBox1.width<ttOuter.width){
                                                ttCss1.left = ttCssPrep.left;
                                                ttCss1.left += 'px';
                                            }
                                            else{
                                                ttCss1.left = ttCssPrep.left - ttBox1.width + ttElem.width;
                                                ttCss1.left += 'px';
                                                //console.log(ttCss1.left);
                                            }
                                            //console.log(ttCss1);

                                            // Now set the calculated positioning and size.
                                            tooltip.css(ttCss1);
                                        }

                                        positionTimeout = null;

                                    }, 0, false);
                                }
                            };

                            // Set up the correct scope to allow transclusion later
                            ttScope.origScope = scope;

                            // By default, the tooltip is not open.
                            // TODO add ability to start tooltip opened
                            ttScope.isOpen = false;

                            function toggleTooltipBind() {
                                if (!ttScope.isOpen) {
                                    showTooltipBind();
                                } else {
                                    hideTooltipBind();
                                }
                            }

                            // Show the tooltip with delay if specified, otherwise show it immediately
                            function showTooltipBind() {
                                if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                                    return;
                                }

                                prepareTooltip();

                                /* get a random number for the event, so we can recognize the event which we want to unbind and leave the useful one
                                   The we create a 'mousemove'event for the body so we can to the justify for the mouse move. Whe the mouse's position is
                                   out of the element and the popover, we can hide the popover to achieve the goal.
                                 */
                                var rand = Math.round(Math.random()*100);

                                // bind a 'mousemove' with a special event name to the body
                                angular.element('body').bind('mousemove.'+rand,   function(e){
                                    var pophead = angular.element($element);
                                    var pop = angular.element('.popover');
                                    var target = e.target;
                                    var isPop = pop.is(target) || pop.has(target).length > 0 || pophead.is(target) || pophead.has(target).length > 0;

                                    // if the mouse move outside, the popover will be hiden and the event will be unbind to improve the system.
                                    if(!isPop){
                                        hideTooltipBind ();
                                        angular.element('body').unbind('mousemove.'+rand);
                                    }
                                });

                                if (ttScope.popupDelay) {
                                    // Do nothing if the tooltip was already scheduled to pop-up.
                                    // This happens if show is triggered multiple times before any hide is triggered.
                                    if (!popupTimeout) {
                                        popupTimeout = $timeout(show, ttScope.popupDelay, false);
                                    }
                                } else {
                                    show();
                                }
                            }

                            function hideTooltipBind () {
                                hide();
                                if (!$rootScope.$$phase) {
                                    $rootScope.$digest();
                                }
                            }

                            // Show the tooltip popup element.
                            function show() {
                                popupTimeout = null;

                                // If there is a pending remove transition, we must cancel it, lest the
                                // tooltip be mysteriously removed.
                                if (transitionTimeout) {
                                    $timeout.cancel(transitionTimeout);
                                    transitionTimeout = null;
                                }

                                // Don't show empty tooltips.
                                if (!(options.useContentExp ? ttScope.contentExp() : ttScope.content)) {
                                    return angular.noop;
                                }

                                createTooltip();

                                // And show the tooltip.
                                ttScope.isOpen = true;
                                if (isOpenExp) {
                                    isOpenExp.assign(ttScope.origScope, ttScope.isOpen);
                                }

                                if (!$rootScope.$$phase) {
                                    ttScope.$apply(); // digest required as $apply is not called
                                }

                                tooltip.css({ display: 'block' });

                                positionTooltip();
                            }

                            // Hide the tooltip popup element.
                            function hide() {
                                // First things first: we don't show it anymore.
                                if(ttScope !== null){

                                    //console.log(ttScope);

                                    ttScope.isOpen = false;
                                    if (isOpenExp) {
                                        isOpenExp.assign(ttScope.origScope, ttScope.isOpen);
                                    }

                                    //if tooltip is going to be shown after delay, we must cancel this
                                    $timeout.cancel(popupTimeout);
                                    popupTimeout = null;

                                    $timeout.cancel(positionTimeout);
                                    positionTimeout = null;

                                    // And now we remove it from the DOM. However, if we have animation, we
                                    // need to wait for it to expire beforehand.
                                    // FIXME: this is a placeholder for a port of the transitions library.
                                    if (ttScope.animation) {
                                        if (!transitionTimeout) {
                                            transitionTimeout = $timeout(removeTooltip, 500);
                                        }
                                    } else {
                                        removeTooltip();
                                    }
                                }
                                else {
                                    removeTooltip();
                                }
                            }

                            function createTooltip() {
                                // There can only be one tooltip element per directive shown at once.
                                if (tooltip) {
                                    removeTooltip();
                                }
                                tooltipLinkedScope = ttScope.$new();
                                tooltip = tooltipLinker(tooltipLinkedScope, function(tooltip) {

                                    if (appendToBody) {
                                        $document.find('body').append(tooltip);
                                    } else {
                                        element.after(tooltip);
                                    }
                                });

                                if (options.useContentExp) {
                                    tooltipLinkedScope.$watch('contentExp()', function(val) {
                                        if (!val && ttScope.isOpen) {
                                            hide();
                                        }
                                    });

                                    tooltipLinkedScope.$watch(function() {
                                        if (!repositionScheduled) {
                                            repositionScheduled = true;
                                            tooltipLinkedScope.$$postDigest(function() {
                                                repositionScheduled = false;
                                                if (ttScope.isOpen) {
                                                    positionTooltip();
                                                }
                                            });
                                        }
                                    });

                                }
                            }

                            function removeTooltip() {
                                transitionTimeout = null;
                                if (tooltip) {
                                    tooltip.remove();
                                    tooltip = null;
                                }
                                if (tooltipLinkedScope) {
                                    tooltipLinkedScope.$destroy();
                                    tooltipLinkedScope = null;
                                }
                            }

                            function prepareTooltip() {
                                prepPopupClass();
                                prepPlacement();
                                prepPopupDelay();
                                prepHideDelay();
                            }

                            ttScope.contentExp = function() {
                                return scope.$eval(attrs[type]);
                            };

                            /**
                             * Observe the relevant attributes.
                             */
                            if (!options.useContentExp) {
                                attrs.$observe(type, function(val) {
                                    ttScope.content = val;

                                    if (!val && ttScope.isOpen) {
                                        hide();
                                    } else {
                                        positionTooltip();
                                    }
                                });
                            }

                            attrs.$observe('disabled', function(val) {
                                if (popupTimeout && val) {
                                    $timeout.cancel(popupTimeout);
                                    popupTimeout = null;
                                }

                                if (val && ttScope.isOpen) {
                                    hide();
                                }
                            });

                            attrs.$observe(prefix + 'Title', function(val) {
                                ttScope.title = val;
                                positionTooltip();
                            });

                            attrs.$observe(prefix + 'Placement', function() {
                                if (ttScope.isOpen) {
                                    prepPlacement();
                                    positionTooltip();
                                }
                            });

                            if (isOpenExp) {
                                scope.$watch(isOpenExp, function(val) {
                                    if (val !== ttScope.isOpen) {
                                        toggleTooltipBind();
                                    }
                                });
                            }

                            function prepPopupClass() {
                                ttScope.popupClass = attrs[prefix + 'Class'];
                            }

                            function prepPlacement() {
                                var val = attrs[prefix + 'Placement'];
                                ttScope.placement = angular.isDefined(val) ? val : options.placement;
                            }

                            function prepPopupDelay() {
                                var val = attrs[prefix + 'PopupDelay'];
                                var delay = parseInt(val, 10);
                                ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
                            }

                            function prepHideDelay(){

                                var val = attrs[prefix + 'HideDelay'];
                                var delay = parseInt(val, 10);
                                ttScope.hideDelay = !isNaN(delay) ? delay : options.hideDelay;
                                //console.log(ttScope.hideDelay);
                            }
                            prepHideDelay();

                            var unregisterTriggers = function() {
                                triggers.show.forEach(function(trigger) {
                                    element.unbind(trigger, showTooltipBind);
                                });
                                triggers.hide.forEach(function(trigger) {
                                    element.unbind(trigger, hideTooltipBind);
                                });
                            };

                            function prepTriggers() {
                                var val = attrs[prefix + 'Trigger'];
                                unregisterTriggers();

                                triggers = getTriggers(val);

                                if (triggers.show !== 'none') {
                                    triggers.show.forEach(function(trigger, idx) {
                                        // Using raw addEventListener due to jqLite/jQuery bug - #4060
                                        if (trigger === triggers.hide[idx]) {
                                            element[0].addEventListener(trigger, toggleTooltipBind);
                                        } else if (trigger) {
                                            element[0].addEventListener(trigger, showTooltipBind);
                                            element[0].addEventListener(triggers.hide[idx], hideTooltipBind);
                                        }
                                    });
                                }
                            }
                            prepTriggers();

                            var animation = scope.$eval(attrs[prefix + 'Animation']);
                            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

                            var appendToBodyVal = scope.$eval(attrs[prefix + 'AppendToBody']);
                            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

                            // if a tooltip is attached to <body> we need to remove it on
                            // location change as its parent scope will probably not be destroyed
                            // by the change.
                            if (appendToBody) {
                                scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess() {
                                    if (ttScope.isOpen) {
                                        hide();
                                    }
                                });
                            }

                            // Make sure tooltip is destroyed and removed.
                            scope.$on('$destroy', function onDestroyTooltip() {
                                $timeout.cancel(transitionTimeout);
                                $timeout.cancel(popupTimeout);
                                $timeout.cancel(positionTimeout);
                                unregisterTriggers();
                                removeTooltip();
                                ttScope = null;
                            });
                        };
                    }
                };
            };
}];
})
// This is mostly ngInclude code but with a custom scope
.directive('tooltipTemplateTranscludeSelf', [
    '$animate', '$sce', '$compile', '$templateRequest',
    function ($animate ,  $sce ,  $compile ,  $templateRequest) {
        return {
            link: function(scope, elem, attrs) {
                var origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);
                attrs.tooltipTemplateTransclude = attrs.tooltipTemplateTranscludeSelf;

                var changeCounter = 0,
                    currentScope,
                    previousElement,
                    currentElement;

                var cleanupLastIncludeContent = function() {
                    if (previousElement) {
                        previousElement.remove();
                        previousElement = null;
                    }
                    if (currentScope) {
                        currentScope.$destroy();
                        currentScope = null;
                    }
                    if (currentElement) {
                        $animate.leave(currentElement).then(function() {
                            previousElement = null;
                        });
                        previousElement = currentElement;
                        currentElement = null;
                    }
                };

                scope.$watch($sce.parseAsResourceUrl(attrs.tooltipTemplateTransclude), function(src) {
                    var thisChangeId = ++changeCounter;

                    if (src) {
                        //set the 2nd param to true to ignore the template request error so that the inner
                        //contents and scope can be cleaned up.
                        $templateRequest(src, true).then(function(response) {
                            if (thisChangeId !== changeCounter) { return; }
                            var newScope = origScope.$new();
                            var template = response;

                            var clone = $compile(template)(newScope, function(clone) {
                                cleanupLastIncludeContent();
                                $animate.enter(clone, elem);
                            });

                            currentScope = newScope;
                            currentElement = clone;

                            currentScope.$emit('$includeContentLoaded', src);
                        }, function() {
                            if (thisChangeId === changeCounter) {
                                cleanupLastIncludeContent();
                                scope.$emit('$includeContentError', src);
                            }
                        });
                        scope.$emit('$includeContentRequested', src);
                    } else {
                        cleanupLastIncludeContent();
                    }
                });

                scope.$on('$destroy', cleanupLastIncludeContent);
            }
        };
    }])

/**
 * Note that it's intentional that these classes are *not* applied through $animate.
 * They must not be animated as they're expected to be present on the tooltip on
 * initialization.
 */
    .directive('tooltipClassesSelf', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if (scope.placement) {
                    element.addClass(scope.placement);
                }
                if (scope.popupClass) {
                    element.addClass(scope.popupClass);
                }
                if (scope.animation()) {
                    element.addClass(attrs.tooltipAnimationClass);
                }

                element.removeClass('popover-template-popup');
                element.addClass('popover-template-popup-self');
            }
        };
    })


    .directive('tooltipClassesArrow', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                if (scope.placement) {
                    element.addClass(scope.placement);
                }
                if (scope.popupClass) {
                    element.addClass(scope.popupClass);
                }
                if (scope.animation()) {
                    element.addClass(attrs.tooltipAnimationClass);
                }
            }
        };
    })

    .directive('tooltipPopup', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: { content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
            templateUrl: 'template/tooltip/tooltip-popup.html'
        };
    })

    // .directive('tooltip', [ '$tooltip', function($tooltip) {
    //     return $tooltip('tooltip', 'tooltip', 'mouseenter');
    // }])

    .directive('tooltipTemplatePopupSelf', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
                originScope: '&' },
            templateUrl: 'template/tooltip/tooltip-template-popup.html'
        };
    })

    .directive('tooltipTemplateSelf', ['$tooltipself', function($tooltipself) {
        return $tooltipself('tooltipTemplateSelf', 'tooltip', 'mouseenter', {
            useContentExp: true
        });
    }])

    .directive('tooltipHtmlPopup', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: { contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
            templateUrl: 'template/tooltip/tooltip-html-popup.html'
        };
    })

    .directive('tooltipHtml', ['$tooltip', function($tooltip) {
        return $tooltip('tooltipHtml', 'tooltip', 'mouseenter', {
            useContentExp: true
        });
    }])

    /*
     Deprecated
     */
    .directive('tooltipHtmlUnsafePopup', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: { content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
            templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
        };
    })

    .value('tooltipHtmlUnsafeSuppressDeprecated', false)
    .directive('tooltipHtmlUnsafe', [
        '$tooltip', 'tooltipHtmlUnsafeSuppressDeprecated', '$log',
        function($tooltip ,  tooltipHtmlUnsafeSuppressDeprecated ,  $log) {
            if (!tooltipHtmlUnsafeSuppressDeprecated) {
                $log.warn('tooltip-html-unsafe is now deprecated. Use tooltip-html or tooltip-template instead.');
            }
            return $tooltip('tooltipHtmlUnsafe', 'tooltip', 'mouseenter');
        }]);

angular.module( 'self.bootstrap.popover', ['self.bootstrap.tooltipself'])

    .directive('popoverTemplateSelfPopup', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@', contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
                originScope: '&' },
            templateUrl: 'template/popover/popover-template-self.html'
        };
    })

    .directive('popoverTemplateArrowPopup', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@', contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
                originScope: '&' },
            templateUrl: 'template/popover/popover-template-arrow.html'
        };
    })

    .directive('popoverTemplateSelf', ['$tooltipself', function($tooltipself) {
        return $tooltipself('popoverTemplateSelf', 'popover', 'click', {
            useContentExp: true
        });
    }])

    .directive('popoverTemplateArrow', ['$tooltipself', function($tooltipself) {
        return $tooltipself('popoverTemplateArrow', 'popover', 'click', {
            useContentExp: true
        });
    }])

    .directive('popoverHtmlPopupSelf', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: { contentExp: '&', title: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
            templateUrl: 'template/popover/popover-html.html'
        };
    })

    .directive('popoverHtmlSelf', ['$tooltipself', function($tooltipself) {
        return $tooltipself( 'popoverHtml', 'popover', 'click', {
            useContentExp: true
        });
    }])

    .directive('popoverPopupSelf', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: { title: '@', content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
            templateUrl: 'template/popover/popover.html'
        };
    })

    .directive('popoverSelf', ['$tooltipself', function($tooltipself) {
        return $tooltipself( 'popover', 'popover', 'click' );
    }]);

angular.module("template/popover/popover-template-self.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("template/popover/popover-template-self.html",
        "<div class=\"popover\"\n" +
        "  tooltip-animation-class=\"fade\"\n" +
        "  tooltip-classes-self\n" +
        "  ng-class=\"{ in: isOpen() }\">\n" +
        //"  <div class=\"arrow\"></div>\n" +
        //"  <div class=\"connection\"></div>\n" +
        "\n" +
        "  <div class=\"popover-inner\">\n" +
        "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
        "      <div class=\"popover-content\"\n" +
        "        tooltip-template-transclude-self=\"contentExp()\"\n" +
        "        tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "");
}]);

angular.module('template/popover/popover-template-arrow.html', []).run(['$templateCache', function($templateCache){
    $templateCache.put("template/popover/popover-template-arrow.html",
        "<div class=\"popover\"\n" +
        "  tooltip-animation-class=\"fade\"\n" +
        "  tooltip-classes-arrow\n" +
        "  ng-class=\"{ in: isOpen() }\">\n" +
       // "  <div class=\"arrow\"></div>\n" +
        "\n" +
        "  <div class=\"popover-inner\">\n" +
        "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>\n" +
        "      <div class=\"popover-content\"\n" +
        "        tooltip-template-transclude-self=\"contentExp()\"\n" +
        "        tooltip-template-transclude-scope=\"originScope()\"></div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "");
}]);
