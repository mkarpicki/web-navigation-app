angular.module('navigationApp.directives').directive('map', ['mapApiService', 'routingService', 'events', function(mapApiService, routingService, events) {

    'use strict';

    var initMenuBubble = function(scope, node) {

        if (!mapApiService) {
            return;
        }

        if (!node || node.getElementsByClassName('menu').length < 1) {
            return;
        }

        var fromItem = node.getElementsByClassName('from'),
            waypointItem = node.getElementsByClassName('waypoint'),
            toItem = node.getElementsByClassName('to'),
            avoidItem =node.getElementsByClassName('avoid');

        attachMenuAction(fromItem[0], function () {
            scope.$emit(events.ADD_START_POINT, mapApiService.getTapPosition());
        });



        attachMenuAction(waypointItem[0], function () { alert('waypointItem ' + mapApiService.getTapPosition() ); });
        attachMenuAction(toItem[0], function () { alert('toItem ' + mapApiService.getTapPosition() ); });
        attachMenuAction(avoidItem[0], function () { alert('avoidItem ' + mapApiService.getTapPosition() ); });


    };

    var attachMenuAction = function (item, callback) {
        if (item) {
            item.onclick = callback;
        }
    };

    var link = function (scope, element, attrs, controller, transclude) {

        transclude(scope, function(nodes) {

            mapApiService.init(element, nodes[1]);

            initMenuBubble(scope,nodes[1]);

        });

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
                    mapApiService.drawRoute(proposedRoutes[i], proposedRoutes[i].waypointsUsedForSearch, proposedRoutes[i].color);
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
        transclude: true,
        link: link
    };

}]);