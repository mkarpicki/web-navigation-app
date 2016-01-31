angular.module('navigationApp.controllers').controller('PageController',
    ["$scope", '$location', 'events', 'routingService', 'stateService', 'geoLocationService', function($scope, $location, events, routingService, stateService, geoLoctionService) {

        'use strict';

        $scope.currentPosition = {
            latitude: 52.51083,
            longitude: 13.45264
        };

        $scope.ready = false;

        var onPositionChangeHandler = null;

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

        var initPositionListener = function () {

            onPositionChangeHandler = $scope.$on(events.POSITION_EVENT, function (event, params) {

                if (params.eventType === events.POSITION_EVENT_TYPES.CHANGE) {

                    var geoPosition = params.param;

                    console.log('geo position changed: ', params.param);
                    console.log(geoPosition.coords.latitude, ' ', geoPosition.coords.longitude);

                    $scope.currentPosition = {
                        latitude : geoPosition.coords.latitude,
                        longitude : geoPosition.coords.longitude
                    };
                    $scope.$apply();

                } else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                    console.log('geo position error: ', params.param);
                }


            });

        };

        var stopPositionListener = function () {

            onPositionChangeHandler();
            onPositionChangeHandler = null;

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

            initPositionListener();

            geoLoctionService.watchPosition();
        };


}]);