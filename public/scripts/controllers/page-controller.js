angular.module('navigationApp.controllers').controller('PageController',
    ["$scope", '$location', 'events', 'routingService', 'stateService', 'geoLocationService', function($scope, $location, events, routingService, stateService, geoLocationService) {

        'use strict';

        var defaultZoomLevel = 14,
            navigationZoomLevel = 16;

        $scope.updateToPosition = false;
        $scope.zoomLevel = defaultZoomLevel;

        $scope.currentPosition = {
            latitude: 52.51083,
            longitude: 13.45264
        };

        $scope.gettingLocationError = false;
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



        //var stopPositionListener = function () {
        //
        //    onPositionChangeHandler();
        //    onPositionChangeHandler = null;
        //
        //};

        $scope.$on(events.POSITION_EVENT, function (event, params) {

            if (params.eventType === events.POSITION_EVENT_TYPES.CHANGE) {

                var geoPosition = params.param;

                $scope.gettingLocationError = false;

                $scope.currentPosition = {
                    latitude : geoPosition.coords.latitude,
                    longitude : geoPosition.coords.longitude
                };

                $scope.$apply();

            } else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                $scope.gettingLocationError = true;
            }


        });

        $scope.$on(events.NAVIGATION_STATE_EVENT, function (event, params) {

            switch (params.eventType) {

                case events.NAVIGATION_STATE_EVENT_TYPES.NAVIGATION_ON:

                    $scope.zoomLevel = navigationZoomLevel;
                    $scope.updateToPosition = true;
                    break;

                case events.NAVIGATION_STATE_EVENT_TYPES.NAVIGATION_OFF:

                    $scope.zoomLevel = defaultZoomLevel;
                    $scope.updateToPosition = false;
                    break;

                default:
                    break;

            }
        });

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

            geoLocationService.watchPosition();
        };


}]);