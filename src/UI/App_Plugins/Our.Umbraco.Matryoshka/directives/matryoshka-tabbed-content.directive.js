(function () {
    'use strict';

    function tabbedContentDirective($timeout) {

        function link($scope, $element, $attrs) {

            var appRootNode = $element[0];
            $scope.currentTab = "";
            if ($scope.content.tabs[0]) {
                $scope.currentTab = $scope.content.tabs[0].label;
            }
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
