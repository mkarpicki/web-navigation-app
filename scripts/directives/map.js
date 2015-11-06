angular.module('navigationApp.directives').directive('map', ['mapApiService', 'routingService', function(mapApiService, routingService) {

    'use strict';

    var link = function (scope, element, attrs) {

        mapApiService.init(element);

        scope.$watch(attrs.centerPosition, function (centerPosition) {

            if (centerPosition) {
                mapApiService.center(centerPosition);
            }
        }, true);

        /**
         * @todo - re think this (maybe no good idea to watch something that in theory will not change to often)
         * @todo - move that to controller of directive
         */
        scope.$watch(function () { return routingService.getResults(); }, function (proposedRoutes) {

            if (proposedRoutes) {

                mapApiService.clear();

                for (var i = 0, l = proposedRoutes.length; i < l; i++) {
                    mapApiService.drawRoute(proposedRoutes[i], proposedRoutes[i].color);
                }
            }
        }, true);

    };

    var scope = {
        centerPosition: '=centerPosition'
    };

    return {
        restrict: 'A',
        scope: scope,
        link: link
    };

}]);