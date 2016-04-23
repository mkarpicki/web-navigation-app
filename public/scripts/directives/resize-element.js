angular.module('navigationApp.directives').directive('resizeElement', ['$window', '$interval', function($window, $interval) {

    'use strict';

    var lastHeight = null;

    var link = function (scope, element) {

        $interval(function () {

            if (!element) {
                return;
            }

            var height = $window.innerHeight - element.prop('offsetTop');

            if (lastHeight && (lastHeight === height)) {
                return;
            }

            element.css({
                height: height + 'px'
            });
            lastHeight = height;

        }, 3000);

    };

    return {
        restrict: 'A',
        link: link
    };

}]);