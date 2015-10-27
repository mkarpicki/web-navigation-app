angular.module('navigationApp.directives').directive('map', ['mapApiService', function(mapApiService) {

    'use strict';

    var link = function (scope, element, attrs) {

        mapApiService.init(element);

        scope.$watch(attrs.centerPosition, function (centerPosition) {

            if (centerPosition) {
                mapApiService.center(centerPosition);
            }
        }, true);

        scope.$watch(attrs.proposedRoutes, function (proposedRoutes) {
            if (proposedRoutes) {

                mapApiService.clear();

                console.log(proposedRoutes);
                for (var i = 0, l = proposedRoutes.length; i < l; i++) {
                    mapApiService.drawRoute(proposedRoutes[i], proposedRoutes[i].color);
                }
            }
        }, true);

    };

    var scope = {
        centerPosition: '=centerPosition',
        proposedRoutes: '=proposedRoutes'

    };

    return {
        restrict: 'A',
        scope: scope,
        link: link
    };

}]);