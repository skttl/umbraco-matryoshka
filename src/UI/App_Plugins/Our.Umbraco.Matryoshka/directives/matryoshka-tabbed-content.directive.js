(function () {
    'use strict';

    function tabbedContentDirective($timeout) {

        function link($scope, $element, $attrs) {

            var appRootNode = $element[0];
            $scope.currentTab = "";
            if ($scope.content.tabs[0]) {
                $scope.currentTab = $scope.content.tabs[0].label;
            }

            $scope.overflowingTabs = 0;


            var tabNavItemsWidths = [];
            // the parent is the component itself so we need to go one level higher
            var container = $element.parent().parent();

            $timeout(function(){
                $element.find(".matryoshka-tabs-list li:not(.umb-tab--expand)").each(function() {
                    tabNavItemsWidths.push($(this).outerWidth());
                });
                calculateWidth();
            });

            function calculateWidth(){
                $timeout(function(){
                    // 70 is the width of the expand menu (three dots) + 20 for the margin on umb-tabs-nav
                    var containerWidth = container.width() - 90;
                    var tabsWidth = 0;
                    $scope.overflowingSections = 0;
                    $scope.needTray = false;
                    $scope.maxTabs = tabNavItemsWidths.length;

                    // detect how many tabs we can show on the screen
                    for (var i = 0; i <= tabNavItemsWidths.length; i++) {
                        
                        var tabWidth = tabNavItemsWidths[i];
                        tabsWidth += tabWidth;

                        if(tabsWidth >= containerWidth) {
                            $scope.needTray = true;
                            $scope.maxTabs = i;
                            $scope.overflowingTabs = $scope.maxTabs - $scope.content.tabs.length;
                            break;
                        }
                    }
                    
                });
            }

            $(window).on('resize.tabsNav', function () {
                console.log("resize");
                calculateWidth();
            });

            $scope.$on('$destroy', function() {
                $(window).off('resize.tabsNav');
            });

        }

        function controller($scope, $element, $attrs) {


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

            $scope.changeTab = function changeTab(label) {
                $scope.currentTab = label;
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
                
            $scope.needTray = false;
            $scope.showTray = false;
            $scope.overflowingSections = 0;

            $scope.toggleTray = toggleTray;
            $scope.hideTray = hideTray;
            
            function toggleTray() {
                $scope.showTray = !$scope.showTray;
            }

            function hideTray() {
                $scope.showTray = false;
            }
        }

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: '/App_Plugins/Our.Umbraco.Matryoshka/directives/matryoshka-tabbed-content.html',
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
