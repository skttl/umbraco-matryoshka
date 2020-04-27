angular.module("umbraco").controller("Matryoshka.GroupSeparator.Controller", [

    "$scope",
    "$rootScope",
    "$timeout",
    "$element",

    function ($scope, $rootScope, $timeout, $element) {
        console.log($element);
        $timeout(function() {
            $element.closest(".umb-property").addClass("our-matryoshka-group-separator-container");
        });

        $scope.toggleCollapse = function() {
            $timeout(function() {
                var separator = $element.closest(".umb-property");
                separator.toggleClass("our-matryoshka-group-separator--collapsed");

                separator.nextUntil(".our-matryoshka-group-separator-container").toggleClass("our-matryoshka-group-separator--collapsed");
            });
        }

        if ($scope.model.config.collapsedByDefault) {
            $scope.toggleCollapse();
        }

    }
]);