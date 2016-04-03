angular.module('navigationApp.directives').directive('map', ['mapApiService', 'routingService', 'stateService', 'events', function(mapApiService, routingService, stateService, events) {

    'use strict';

    /**
     * fire event with specific type.
     * position is optional - in case not delivered - taken current tapped position from mapService
     * @param scope
     * @param type
     * @param geoParam
     */
    var emitEvent = function (scope, type, geoParam) {

        scope.$emit(events.MAP_EVENT, {
            eventType: type,
            geoParam: geoParam
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
            newDestinationItem,// = node.getElementsByClassName('to')[0],
            avoidItem = node.getElementsByClassName('avoid')[0];


        attachMenuAction(overwrittenStartItem, function () {
            emitEvent(scope, events.MAP_EVENT_TYPES.OVERWRITE_START_POINT, mapApiService.getTapPosition());
        });

        attachMenuAction(newWayPointItem, function () {
            emitEvent(scope, events.MAP_EVENT_TYPES.ADD_WAY_POINT, mapApiService.getTapPosition());
        });

        attachMenuAction(overwrittenDestinationItem, function () {
            emitEvent(scope, events.MAP_EVENT_TYPES.OVERWRITE_DESTINATION_POINT, mapApiService.getTapPosition());
        });


        attachMenuAction(newDestinationItem, function () {
            emitEvent(scope, events.MAP_EVENT_TYPES.ADD_DESTINATION_POINT, mapApiService.getTapPosition());
        });

        attachMenuAction(avoidItem, function () {
            var tapPosition = mapApiService.getTapPosition(),
                obj = angular.extend({},tapPosition, mapApiService.calculateRectangle(tapPosition));
            emitEvent(scope, events.MAP_EVENT_TYPES.AVOID_AREA, obj);
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

        scope.$watch(attrs.zoomLevel, function (zoomLevel) {

            if (zoomLevel) {
                mapApiService.zoomLevel(zoomLevel);
            }
        });

        scope.$watchGroup([attrs.currentPosition, attrs.updateToPosition], function (newValues) {

            var currentPosition = newValues[0],
                doUpdatePosition = newValues[1];

            if (currentPosition) {

                if (doUpdatePosition) {
                    mapApiService.center(currentPosition);
                }
                mapApiService.updateCurrentPosition(currentPosition);
            }
        }, true);

        //scope.$watchGroup([attrs.routes, attrs.wayPoints, attrs.areasToAvoid], function (newValues) {
        //
        //    var proposedRoutes = newValues[0];
        //
        //    /**
        //     * @todo
        //     */
        //        //add waypoints and areas here
        //        //expose from service method to draw them and call here
        //
        //    mapApiService.clear();
        //
        //
        //    if (proposedRoutes) {
        //
        //        for (var i = 0, l = proposedRoutes.length; i < l; i++) {
        //            mapApiService.drawRoute(proposedRoutes[i], proposedRoutes[i].wayPointsUsedForSearch, proposedRoutes[i].color);
        //        }
        //    }
        //
        //}, true);

        scope.$watch(attrs.routes, function (proposedRoutes) {

            /**
             * @todo
             */
            //add waypoints and areas here
            //expose from service method to draw them and call here

            /**
             * @todo - after clearing draw even if no new values (method up)
             */
            mapApiService.clear();


            if (proposedRoutes) {

                for (var i = 0, l = proposedRoutes.length; i < l; i++) {
                    mapApiService.drawRoute(proposedRoutes[i], proposedRoutes[i].wayPointsUsedForSearch, proposedRoutes[i].color);
                }
            }

        }, true);
        
    };

    var scope = {
        currentPosition: '=currentPosition',
        zoomLevel: '=zoomLevel',
        updateToPosition: '=updateToPosition',
        routes: '=routes',
        wayPoints: '=wayPoints',
        areasToAvoid: '=areasToAvoid'
    };

    return {
        restrict: 'A',
        scope: scope,
        transclude: true,
        link: link
    };

}]);