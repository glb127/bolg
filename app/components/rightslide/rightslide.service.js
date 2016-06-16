'use strict';

angular.module('cloudxWebApp')
    .factory('$rightSlideDialog', ["$rootScope","$state", function($rootScope,$state) {
        var dialogs = {},
            visibleDialogs = {
                stack: [],
                top: 0,
                push: function(dialog) {
                    this.stack[this.top++] = dialog;
                },
                pop: function() {
                    return this.stack[--this.top];
                },
                getTop: function() {
                    return this.stack[this.top - 1];
                },
                clear: function() {
                    this.top = 0;
                }
            };

        function Dialog(name, shouldBroadcast,backRouter) {
            this.isVisible = false;

            if (!name) {
                throw new Error('Dialog needs a name');
            }

            this.originalName = name;
            this.name = stripInvalidChars(name);
            this.shouldBroadcast = shouldBroadcast;
            this.backRouter = backRouter;
        }

        Dialog.prototype.open = function() {
            this.isVisible = true;
            visibleDialogs.push(this);

            if (this.shouldBroadcast) {
                $rootScope.$broadcast('rightSlideDialog.opened', this.originalName);
            }
        };

        Dialog.prototype.close = function() {
            if (this.isVisible) {
                this.isVisible = false;
                visibleDialogs.pop();
            }

            if (this.shouldBroadcast) {
                $rootScope.$broadcast('rightSlideDialog.closed', this.originalName);
            }
            if(this.backRouter){
                reset();
                $state.go(this.backRouter);
            }
        };

        function open(dialogName) {
            dialogName = stripInvalidChars(dialogName);
            dialogs[dialogName].open();
        }

        function close(dialogName) {
            dialogName = dialogName ? stripInvalidChars(dialogName) : visibleDialogs.getTop().name;
            dialogs[dialogName].close();

        }

        function create(dialogName, shouldBroadcast,backRouter) {
            dialogs[stripInvalidChars(dialogName)] = new Dialog(dialogName, shouldBroadcast,backRouter);
            if (shouldBroadcast) {
                $rootScope.$broadcast('rightSlideDialog.created', stripInvalidChars(dialogName));
            }
            return dialogs[stripInvalidChars(dialogName)];
        }

        function reset() {
            dialogs = {};
            visibleDialogs.clear();
        }

        function stripInvalidChars(dialogName) {
            return dialogName.replace(/\.|\:/g, '_$_');
        }


        return {
            open: open,
            close: close,
            create: create,
            reset: reset
        };
    }])
    .directive('rightSlideDialog', ["$timeout", "$rightSlideDialog", function($timeout, $rightSlideDialog,$animate) {
        return {
            restrict : 'EA',
            scope: {},
            transclude: true,
            template : '<div class="ud_rightslide" ng-show="dialog.isVisible"><div class="ud_rightslide_bg"></div><div class="ud_rightslide_content"  ng-class="{in:!dialog.noSlide}"><div class="rs_content" ng-transclude></div><a class="rightslide_clps" ng-click="dialog.close()"><span class="iconfont">&#xe748;</span></a></div></div>',
            link: function(scope, element, attrs) {
                var backdropEl = angular.element(document.createElement('div')).addClass('quick-dialog__backdrop'),
                    ESC = 27,
                    body = angular.element(document.body),
                    windowEl = angular.element(window),
                    focusEl = document.getElementById(attrs.openFocus) || element[0],
                    closeFocusEl = document.getElementById(attrs.closeFocus),
                    originalExitFocusEl = document.getElementById(attrs.closeFocus);

                scope.dialog = $rightSlideDialog.create(attrs.dialogName, attrs.shouldBroadcast ,attrs.backRouter);
                scope.dialog.noSlide = attrs.noSlide;
                $rightSlideDialog.open(attrs.dialogName);

                // Skip initial dirty check otherwise stack top becomes negative
                var initialCheck = true;
                scope.$watch('dialog.isVisible', function(isVisible) {
                    if (!initialCheck) {
                        if (isVisible) {
                            openDialog();
                        } else {
                            closeDialog();
                        }
                    }
                    initialCheck = false;
                });

                // Clear cached dialogs and visiblility stack whenever switching views.
                scope.$on('$routeChangeStart', function() {
                    $rightSlideDialog.reset();
                });

                function openDialog() {
                    closeFocusEl = closeFocusEl || document.activeElement;
                    body.append(backdropEl);
                    backdropEl.bind('click', onClick);
                    windowEl.bind('keydown', onEsc);
                    // $animate.addClass(backdropEl, "switching11", function () {
                    //     //elem.removeClass("switching");
                    // });
                    $timeout(function openFocus() {
                        focusEl.focus();
                    });
                }

                function closeDialog() {
                    windowEl.unbind('keydown', onEsc);
                    backdropEl.unbind('click', onClick);
                    backdropEl.remove();                    

                    if (closeFocusEl !== null) {
                        closeFocusEl.focus();
                        closeFocusEl = originalExitFocusEl;
                    }
                }

                function onEsc(event) {
                    if (event.keyCode === ESC) {
                        event.preventDefault();
                        $timeout(function() {
                            scope.dialog.close();
                        });
                        closeDialog();
                    }
                }

                function onClick(event) {
                    event.stopPropagation();
                    $timeout(function() {
                        scope.dialog.close();
                    });
                    closeDialog();
                }
                
            }
        }
    }]);