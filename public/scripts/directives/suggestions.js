angular.module('navigationApp.directives').directive('suggestions', [function() {

    'use strict';


    var link = function (scope, element, attrs, controller) {

        scope.$watch(attrs.suggestions, function (suggestions) {

            console.log('suggestions');
            console.log(suggestions);
        });

    };

    var scope = {
        suggestions: '=suggestions'
    };

    return {
        restrict: 'A',
        templateUrl: '/scripts/directives/suggestions.html',
        //replace: true,
        scope: scope,
        link: link
    };

}]);