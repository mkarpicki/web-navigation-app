angular.module('navigationApp.directives').directive('backButton', ['$window', function($window) {

    'use strict';

    var goBack = function () {
        $window.history.back();
    };

    var link = function (scope, element) {

        element.bind('click', goBack);

    };

    return {
        restrict: 'A',
        link: link
    };

}]);