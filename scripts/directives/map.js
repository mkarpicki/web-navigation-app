angular.module('navigationApp.directives').directive('map', ['mapApiService', function(mapApiService) {

    'use strict';

    var link = function (scope, element, attrs) {

        mapApiService.init(element);

        scope.$watch(attrs.centerPosition, function (value) {
            console.log('m:' + value);
            mapApiService.center(value);
        }, true);

    };

    var scope = {
        centerPosition: '=centerPosition'

    };

    var mapDirective = {
        restrict: 'A',
        scope: scope,
        link: link
    };

    return mapDirective;

}]);