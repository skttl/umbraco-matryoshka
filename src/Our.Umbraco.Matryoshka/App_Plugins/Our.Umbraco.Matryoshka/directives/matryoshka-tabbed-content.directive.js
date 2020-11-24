(function () {
    'use strict';

    function tabbedContentDirective($timeout, eventsService) {

        function link($scope, $element, $attrs) {

            var appRootNode = $element[0];
            $scope.currentTab = "";
            if ($scope.content.tabs[0]) {
                $scope.currentTab = $scope.content.tabs[0].label;
            }

            $scope.overflowingTabs = 0;

            var tabNavItemsWidths = [];

            $timeout(function () {
                $element.find(".matryoshka-tab-link").each(function () {
                    tabNavItemsWidths.push($(this).outerWidth());
                });
                calculateWidth();
            });

            function calculateWidth() {
                $timeout(function () {
                    $scope.overflowingSections = 0;
                    $scope.needTray = false;
                    $scope.maxTabs = tabNavItemsWidths.length;

                    // detect how many tabs we can show on the screen
                    var tabsWidth = 0;
                    //containerWidth = element innerWidth - 75 (umb-tab-button) + 5px for rounding issues and to prevent multilining during resizing.
                    var containerWidth = $element.innerWidth() - 75;
                    for (var i = 0; i <= tabNavItemsWidths.length; i++) {
                        var tabWidth = tabNavItemsWidths[i];
                        tabsWidth += tabWidth;
                        if (tabsWidth >= containerWidth) {

                            $scope.needTray = true;
                            $scope.maxTabs = i;
                            $scope.overflowingTabs = $scope.maxTabs - $scope.content.tabs.length;
                            break;
                        }
                    }

                });
            }

            var ro = new ResizeObserver(function () {
                calculateWidth();
            });
            ro.observe(appRootNode);
        }

        function controller($scope, $element, $attrs, $timeout) {

            var appRootNode = $element[0];

            $scope.currentTab = $scope.content.tabs[0];

            this.content = $scope.content;
            this.activeVariant = _.find(this.content.variants, variant => {
                return variant.active;
            });


            $scope.hide = function (label) {
                if ($scope.currentTab === label) {
                    return false;
                }
                return true;
            };

            // on changeTab event we change the tab so all active tab instances are synced.
            eventsService.on("matryoshka.tabbedContent.changedTab", function (event, args) {
                //broadcastEvent is false so we don't create a loop
                if ($scope.$parent.content?.id == args.contentId) {
                    $scope.changeTab(args.label, false)
                }
            });

            $scope.changeTab = function changeTab(label, broadcastEvent = true) {
                $scope.currentTab = label;
                $scope.scrollTo(label, 0);
                //if broadcastEvent is true and tabs are synced eventsService is used to broadcast event.
                if (broadcastEvent && $scope.syncTabs) {

                    eventsService.emit("matryoshka.tabbedContent.changedTab", { label: label, contentId: $scope.$parent.content?.id });
                }
            };

            $scope.activeVariant = this.activeVariant;

            $scope.defaultVariant = _.find(this.content.variants, variant => {
                return variant.language.isDefault;
            });

            $scope.unlockInvariantValue = function (property) {
                property.unlockInvariantValue = !property.unlockInvariantValue;
            };

            $scope.$watch("tabbedContentForm.$dirty",
                function (newValue, oldValue) {
                    if (newValue === true) {
                        $scope.content.isDirty = true;
                    }
                }
            );

            // on syncstate event we set the syncstate to the new state for all active controllers.
            eventsService.on("matryoshka.tabbedContent.changedSyncState", function (event, args) {
                $scope.syncTabs = args.syncTabs;
            });

            // Emits syncstate so it can be used in all active controllers.
            function toggleSync() {
                eventsService.emit("matryoshka.tabbedContent.changedSyncState", { syncTabs: !$scope.syncTabs });
            }

            // When the splitViewChanged event is broadcasted set the variable splitview
            // to true if the arg contains more than one editor.
            $scope.$on("editors.content.splitViewChanged", function (event, args) {
                if (args.editors.length > 1) {
                    $scope.splitview = true
                } else {
                    $scope.splitview = false;
                }
            });

            $scope.needTray = false;
            $scope.showTray = false;
            $scope.overflowingSections = 0;

            $scope.toggleTray = toggleTray;
            $scope.hideTray = hideTray;

            $scope.splitview = false;
            $scope.syncTabs = true;
            $scope.toggleSync = toggleSync;

            function toggleTray() {
                $scope.showTray = !$scope.showTray;
            }

            function hideTray() {
                $scope.showTray = false;
            }


            $scope.groupSeparators = {};
            var scrollableNode = appRootNode.closest('.umb-scrollable');
            scrollableNode.addEventListener('mousewheel', cancelScrollTween);

            function getScrollPositionFor(tab, alias) {
                var offset = null;
                var groupSeparator = null;

                if (alias == 0) {
                    offset = 0;
                } else {
                    var previousTab = $scope.currentTab + "";
                    $scope.currentTab = tab;

                    groupSeparator = document.querySelector("#our-matryoshka-group-separator-" + alias);

                    if (!groupSeparator) {
                        $scope.currentTab = previousTab;
                        offset = null;
                    }
                }

                return $timeout(function () {
                    if (groupSeparator) {
                        offset = groupSeparator.closest(".umb-control-group").offsetTop;
                    }

                    return offset;
                });
            }

            // on scrolledTo event we change the scrollposition so all active tab instances are synced.
            eventsService.on("matryoshka.tabbedContent.scrolledTo", function (event, args) {
                //broadcastEvent is false so we don't create a loop
                $scope.scrollTo(args.tab, args.alias, false)
            });

            $scope.scrollTo = function (tab, alias, broadcastEvent = true) {
                getScrollPositionFor(tab, alias).then(function(response) {
                    var y = response;

                    if (alias === 0 || y !== null) {
                        var viewportHeight = scrollableNode.clientHeight;
                        var from = scrollableNode.scrollTop;
                        var to = Math.min(y, scrollableNode.scrollHeight - viewportHeight);
                        var animeObject = { _y: from };
                        $scope.scrollTween = anime({
                            targets: animeObject,
                            _y: to,
                            easing: 'easeOutExpo',
                            duration: 200 + Math.min(Math.abs(to - from) / viewportHeight * 100, 400),
                            update: function update() {
                                scrollableNode.scrollTo(0, animeObject._y);
                            }
                        });
                    }
                });
                //if broadcastEvent is true and tabs are synced eventsService is used to broadcast event.
                if (broadcastEvent && $scope.syncTabs) {
                    eventsService.emit("matryoshka.tabbedContent.scrolledTo", { tab: tab, alias: alias });
                }
            }
            function cancelScrollTween() {
                if ($scope.scrollTween) {
                    $scope.scrollTween.pause();
                }
            }

            $scope.content.tabs.map(function(tab) {
                $scope.groupSeparators[tab.label] = [];

                tab.properties.map(function(prop, i) {
                    if (prop.editor == "Our.Umbraco.Matryoshka.GroupSeparator" && prop.config.anchor == "1") {
                        $scope.groupSeparators[tab.label].push(prop);
                    }
                });
            });

            //ensure to unregister from all dom-events
            $scope.$on('$destroy', function () {
                cancelScrollTween();
            });
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Our.Umbraco.Matryoshka/directives/matryoshka-tabbed-content.html?umb_rnd=' + Umbraco.Sys.ServerVariables.application.cacheBuster,
            controller: controller,
            link: link,
            scope: {
                content: "="
            }
        };

        return directive;

    }

    angular.module('umbraco.directives').directive('matryoshkaTabbedContent', tabbedContentDirective);

})();
