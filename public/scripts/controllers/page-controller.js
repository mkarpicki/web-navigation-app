angular.module('navigationApp.controllers').controller('PageController',
    ["$scope", '$location', 'events', 'routingService', 'stateService', function($scope, $location, events, routingService, stateService) {

        'use strict';

        $scope.centerPosition = {
            latitude: 52.51083,
            longitude: 13.45264
        };

        $scope.ready = false;

        var apply = function () {
            routingService.clearResults();
            $scope.$apply();
        };

        var overwriteStartPoint = function (position) {

            var point = position.latitude + ',' + position.longitude;

            stateService.overwriteStartPoint(point);

        };

        var overwriteDestinationPoint = function (position) {

            var point = position.latitude + ',' + position.longitude;

            stateService.overwriteDestinationPoint(point);

        };

        var addWayPoint = function (position) {

            var point = position.latitude + ',' + position.longitude;

            stateService.addWayPoint(point);

        };

        var addAreaToAvoid = function (geoParam) {

            var item = geoParam.topLeft.latitude + "," + geoParam.topLeft.longitude + ";" + geoParam.bottomRight.latitude + "," + geoParam.bottomRight.longitude;

            stateService.addAreaToAvoid(item);

        };

        $scope.$on(events.MAP_EVENT, function (event, params) {

            var geoParam = params.geoParam;

            switch (params.eventType) {

                case events.MAP_EVENT_TYPES.OVERWRITE_START_POINT:

                    overwriteStartPoint(geoParam);
                    break;

                case events.MAP_EVENT_TYPES.OVERWRITE_DESTINATION_POINT:

                    overwriteDestinationPoint(geoParam);
                    break;

                case events.MAP_EVENT_TYPES.ADD_WAY_POINT:

                    addWayPoint(geoParam);
                    break;

                case events.MAP_EVENT_TYPES.AVOID_AREA:

                    addAreaToAvoid(geoParam);
                    break;

                default:
                    break;
            }

            var query = stateService.serializeQuery();

            $location.url('/?' + query);
            apply();
        });

        $scope.pageReady = function () {
            $scope.ready = true;
        };

}]);