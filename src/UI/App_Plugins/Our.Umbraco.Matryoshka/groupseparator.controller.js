angular.module("umbraco").controller("Matryoshka.GroupSeparator.Controller", [

    "$scope",
    "$timeout",
    "$element",

    function ($scope, $timeout, $element) {

        var separator = $element.closest(".umb-nested-content-property-container");
        if (separator.length == 0) {
            separator = $element.closest(".umb-property");
        }
        
        $timeout(function() {
            separator.addClass("our-matryoshka-group-separator-container");
        });

        $scope.toggleCollapse = function() {
            $timeout(function() {
                separator.toggleClass("our-matryoshka-group-separator--collapsed");
                separator.nextUntil(".our-matryoshka-group-separator-container").toggleClass("our-matryoshka-group-separator--collapsed");
            });
        }

        if ($scope.model.config.collapsedByDefault) {
            $scope.toggleCollapse();
        }

    }
]);