angular.module('navigationApp.directives').directive('backButton', ['$window', function($window) {

    'use strict';

    //var scope = {};

    var goBack = function () {
        $window.history.back();
    };

    var link = function (scope, element) {

        element.bind('click', goBack);

    };

    //var controller = function (scope) {
    //
    //    scope.goBack = goBack;
    //};

    return {
        restrict: 'A',
        //controller: controller,
        //scope: scope,
        link: link
    };

}]);