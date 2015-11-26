angular.module('navigationApp.directives').directive('map', ['mapApiService', 'routingService', 'events', function(mapApiService, routingService, events) {

    'use strict';

    /**
     * fire event with specific type.
     * position is optional - in case not delivered - taken current tapped position from mapService
     * @param type
     * @param position
     */
    var emitEvent = function (scope, type) {

        var position = mapApiService.getTapPosition();

        scope.$emit(events.MAP_EVENT, {
            eventType: type,
            position: position
        });

        mapApiService.removeBubble();
    };

    var initMenuBubbleEvent = function(scope, node) {

        if (!mapApiService) {
            return;
        }

        if (!node || node.getElementsByClassName('menu').length < 1) {
            return;
        }

        mapApiService.initBubble(node);

        /**
         * @todo
         * when adding new functionality (add new start point / end point) on top of current overwrite
         * then make classes more specific
         * and introduce new items (both: here and on template)
         */
        var overwrittenStartItem = node.getElementsByClassName('from')[0],
            newWayPointItem = node.getElementsByClassName('waypoint')[0],
            overwrittenDestinationItem = node.getElementsByClassName('to')[0],
            avoidItem =node.getElementsByClassName('avoid')[0];


        attachMenuAction(overwrittenStartItem, function () {
            emitEvent(scope, events.MAP_EVENT_TYPES.OVERWRITE_START_POINT);
        });

        attachMenuAction(newWayPointItem, function () {
            emitEvent(scope, events.MAP_EVENT_TYPES.ADD_WAY_POINT);
        });

        attachMenuAction(overwrittenDestinationItem, function () {
            emitEvent(scope, events.MAP_EVENT_TYPES.OVERWRITE_DESTINATION_POINT);
        });



        attachMenuAction(avoidItem, function () {
            console.log(mapApiService.calculateRecangle(mapApiService.getTapPosition(), 120));
        });

    };

    var attachMenuAction = function (item, callback) {
        if (item) {
            item.onclick = callback;
        }
    };

    var link = function (scope, element, attrs, controller, transclude) {

        transclude(scope, function(nodes) {

            mapApiService.init(element, nodes[1]);

            initMenuBubbleEvent(scope, nodes[1]);

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