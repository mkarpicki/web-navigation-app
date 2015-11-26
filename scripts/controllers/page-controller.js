angular.module('navigationApp.controllers').controller('PageController',
    ["$scope", '$location', 'events', 'routingService', 'queryParserService', function($scope, $location, events, routingService, queryParserService) {

        'use strict';

        var apply = function () {
            routingService.clearResults();
            $scope.$apply();
        };

        var overwriteStartPoint = function (wayPoints, areasToAvoid, position) {

            wayPoints[0] = position.latitude + ',' + position.longitude;

            return queryParserService.serializeWayPoints(wayPoints);

        };

        var overwriteDestinationPoint = function (wayPoints, areasToAvoid, position) {

            var point = position.latitude + ',' + position.longitude;

            if (wayPoints.length < 2) {

                wayPoints.push(point);

            } else {

                wayPoints[wayPoints.length - 1] = point;

            }

            return queryParserService.serializeWayPoints(wayPoints);

        };

        /**
         * @fixme (I do not work) :]
         * @param wayPoints
         * @param position
         * @returns {*}
         */
        var addWayPoint = function (wayPoints, areasToAvoid, position) {

            var wayPoint = position.latitude + ',' + position.longitude;


            if (wayPoints.length < 2) {

                wayPoints[wayPoints.length] =wayPoint;

            } else {

                var endPoint = wayPoints[wayPoints.length - 1];

                wayPoints[wayPoints.length - 1] = wayPoint;

                wayPoints.push(endPoint);
            }


            return queryParserService.serializeWayPoints(wayPoints);
        };

        var addAreaToAvoid = function (wayPoints, areasToAvoid, geoParam) {

        };

        $scope.centerPosition = {
            latitude: 52.51083,
            longitude: 13.45264
        };


        $scope.$on(events.MAP_EVENT, function (event, params) {

            var geoParam = params.geoParam,
                query = '',
                wayPoints = queryParserService.deserializeWayPoints($location.search()),
                areasToAvoid = {};

            switch (params.eventType) {

                case events.MAP_EVENT_TYPES.OVERWRITE_START_POINT:

                    query = overwriteStartPoint(wayPoints, areasToAvoid, geoParam);
                    break;

                case events.MAP_EVENT_TYPES.OVERWRITE_DESTINATION_POINT:

                    query = overwriteDestinationPoint(wayPoints, areasToAvoid, geoParam);
                    break;

                case events.MAP_EVENT_TYPES.ADD_WAY_POINT:
                    query = addWayPoint(wayPoints, areasToAvoid, geoParam);
                    break;

                case events.MAP_EVENT_TYPES.AVOID_AREA:
                    query = addAreaToAvoid(wayPoints, areasToAvoid, geoParam);
                    break;

                default:
                    break;
            }

            $location.url('/?' + query);
            apply();
        });

        $scope.pageReady = function () {
            $scope.ready = true;
        };

}]);