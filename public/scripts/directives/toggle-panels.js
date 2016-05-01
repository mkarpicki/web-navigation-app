angular.module('navigationApp.directives').directive('togglePanels', ['$window', function($window) {

    'use strict';

    var scope = {
        toggled: '&'
    };

    var link = function (scope, element, attrs, controller) {

        scope.toggled = scope.toggled();

    };

    return {
        restrict: 'A',
        templateUrl: 'scripts/directives/toggle-panels.html',
        //require: "backButton",
        scope: scope,
        link: link
    };

}]);