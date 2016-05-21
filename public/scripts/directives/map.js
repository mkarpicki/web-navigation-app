angular.module('navigationApp.directives').directive('map', ['mapApiService', 'events', '$interval', function(mapApiService, events, $interval) {

    'use strict';

    var lastElementSize = null;

    var scope = {
        currentPosition: '=currentPosition',
        zoomLevel: '=zoomLevel',
        updateToPosition: '=updateToPosition',
        routes: '=routes',
        wayPoints: '=wayPoints',
        areasToAvoid: '=areasToAvoid'
    };

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
            newWayPointItem = node.getElementsByClassName('way-point')[0],
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

    var reDrawMap = function (routes, wayPoints, areasToAvoid) {

        mapApiService.clear();

        if (routes) {
            mapApiService.drawRoutes(routes);
        }

        if (wayPoints) {
            mapApiService.drawWayPoints(wayPoints);
        }

        if (areasToAvoid) {
            mapApiService.drawAreasToAvoid(areasToAvoid);
        }

    };

    var link = function (scope, element, attrs, controller, transclude) {

        transclude(scope, function(nodes) {

            mapApiService.init(element, nodes[1]);

            initMenuBubbleEvent(scope, nodes[1]);

        });

        scope.allowAddingWayPoints = function () {
            var validWayPoints = scope.wayPoints.filter(function (wayPoint) {
                return wayPoint && wayPoint.coordinates && wayPoint.coordinates.latitude && wayPoint.coordinates.longitude;
            });
            return validWayPoints.length >= 2;
        };

        scope.$watch(attrs.zoomLevel, function (zoomLevel) {

            if (zoomLevel) {
                mapApiService.setZoomLevel(zoomLevel);
            }
        });

        /**
         * @todo bring it back but improve as I see whole world sometimes
         */
        $interval(function () {

            var newElementSize = [element[0].offsetWidth, element[0].offsetHeight].join('x');

            if (newElementSize === lastElementSize) {
                return;
            }

            lastElementSize = newElementSize;

            mapApiService.resizeMap();

        }, 1000);


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

        //scope.$watchGroup([attrs.routes, attrs.wayPoints, attrs.areasToAvoid], function (newValues, oldValues) {
        //
        //    //anything changed?
        //    if (!newValues[0] && !newValues[1] && newValues[2]) {
        //        return;
        //    }
        //
        //    var routes = newValues[0] || oldValues[0],
        //        wayPoints = newValues[1] || oldValues[1],
        //        areasToAvoid = newValues[2] || oldValues[2];
        //
        //    mapApiService.clear();
        //
        //
        //    if (routes) {
        //
        //        for (var i = 0, l = routes.length; i < l; i++) {
        //            mapApiService.drawRoute(routes[i], routes[i].wayPointsUsedForSearch, routes[i].color);
        //        }
        //    }
        //
        //    if (wayPoints) {
        //        mapApiService.drawWayPoints(wayPoints);
        //    }
        //
        //    if (areasToAvoid) {
        //
        //    }
        //
        //}, true);

        scope.$watch(attrs.wayPoints, function (wayPoints) {

            reDrawMap(scope.routes, wayPoints, scope.areasToAvoid);

        }, true);

        scope.$watch(attrs.areasToAvoid, function (areasToAvoid) {

            reDrawMap(scope.routes, scope.wayPoints, areasToAvoid);

        }, true);

        scope.$watch(attrs.routes, function (routes) {

            reDrawMap(routes, scope.wayPoints, scope.areasToAvoid);

        }, true);

    };

    return {
        restrict: 'A',
        scope: scope,
        transclude: true,
        link: link
    };

}]);