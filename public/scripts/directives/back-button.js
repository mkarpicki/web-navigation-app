angular.module('navigationApp.directives').directive('backButton', ['$window', function($window) {

    'use strict';

    var scope = {};

    var goBack = function () {
        $window.history.back();
    };

    var link = function (scope, element) {

        element.bind('click', goBack);

    };

    return {
        restrict: 'A',
        scope: scope,
        link: link
    };

}]);