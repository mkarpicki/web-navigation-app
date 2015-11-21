angular.module('navigationApp.controllers').controller('PageController',
    ["$scope", '$location', 'events', 'routingService', 'queryParserService', function($scope, $location, events, routingService, queryParserService) {

        'use strict';

        var apply = function () {
            routingService.clearResults();
            $scope.$apply();
        };

        var overwriteStartPoint = function (wayPoints, position) {

            wayPoints[0] = position.latitude + ',' + position.longitude;

            return queryParserService.serializeWayPoints(wayPoints);

        };

        var overwriteDestinationPoint = function (wayPoints, position) {

            wayPoints[wayPoints.length - 1] = position.latitude + ',' + position.longitude;

            return queryParserService.serializeWayPoints(wayPoints);

        };

        /**
         * @fixme (I do not work) :]
         * @param wayPoints
         * @param position
         * @returns {*}
         */
        var addWayPoint = function (wayPoints, position) {

            wayPoints.splice(wayPoints.length - 1, 0, (position.latitude + ',' + position.longitude));

            return queryParserService.serializeWayPoints(wayPoints);
        };

        $scope.centerPosition = {
            latitude: 52.51083,
            longitude: 13.45264
        };


        $scope.$on(events.MAP_EVENT, function (event, params) {

            var position = params.position,
                query = '',
                wayPoints = queryParserService.deserializeWayPoints($location.search());

            switch (params.eventType) {

                case events.MAP_EVENT_TYPES.OVERWRITE_START_POINT:

                    query = overwriteStartPoint(wayPoints, position);
                    break;

                case events.MAP_EVENT_TYPES.OVERWRITE_DESTINATION_POINT:

                    query = overwriteDestinationPoint(wayPoints, position);
                    break;

                case events.MAP_EVENT_TYPES.ADD_WAY_POINT:
                    query = addWayPoint(wayPoints, position);
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