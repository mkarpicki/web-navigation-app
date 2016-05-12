angular.module('navigationApp.controllers').controller('PageController',
    ["$scope", '$location', '$q', 'events', 'stateService', 'geoLocationService', 'geoCoderService', function($scope, $location, $q, events, stateService, geoLocationService, geoCoderService) {

        'use strict';

        var defaultZoomLevel = 14,
            navigationZoomLevel = 16,
            firstPositionFound = false;

        //set by default true to center map on first found position
        $scope.updateToPosition = true;
        $scope.zoomLevel = defaultZoomLevel;

        $scope.currentPosition = {
            latitude: 52.51083,
            longitude: 13.45264
        };

        $scope.wayPoints = null;
        $scope.areasToAvoid = null;

        $scope.routes = null;

        $scope.gettingLocationError = false;
        $scope.ready = false;
        $scope.forceToggleToHide = false;

        var overwriteStartPoint = function (point, text) {

            stateService.overwriteStartPoint({
                title: text,
                coordinates: {
                    latitude: point.latitude,
                    longitude: point.longitude
                }
            });

        };

        var overwriteDestinationPoint = function (point, text) {

            stateService.overwriteDestinationPoint({
                title: text,
                coordinates: {
                    latitude: point.latitude,
                    longitude: point.longitude
                }
            });

        };

        var addDestinationPoint = function (point, text) {

            stateService.addDestinationPoint({
                title: text,
                coordinates: {
                    latitude: point.latitude,
                    longitude: point.longitude
                }
            });

        };

        var addWayPoint = function (point, text) {

            stateService.addWayPoint({
                title: text,
                coordinates: {
                    latitude: point.latitude,
                    longitude: point.longitude
                }
            });

        };

        var addAreaToAvoid = function (geoParam, text) {

            var item = {
                boundingBox: {
                    topLeft: geoParam.topLeft,
                    bottomRight: geoParam.bottomRight
                },
                title: text
            };

            stateService.addAreaToAvoid(item);

        };

        var updateState = function () {

            var query = stateService.serializeQuery();

            $location.url('/?' + query);
            stateService.clearRoutes();
        };

        //var stopPositionListener = function () {
        //
        //    onPositionChangeHandler();
        //    onPositionChangeHandler = null;
        //
        //};

        $scope.onlyMapShown = function () {
            return !!($location.hash());
        };

        $scope.$on(events.POSITION_EVENT, function (event, params) {

            if (params.eventType === events.POSITION_EVENT_TYPES.CHANGE) {

                var geoPosition = params.param;

                $scope.gettingLocationError = false;

                $scope.currentPosition = {
                    latitude : geoPosition.coords.latitude,
                    longitude : geoPosition.coords.longitude
                };

                $scope.$apply();

                //on first found position map was updated
                //reset value to stop updating it
                //it may be turned on again by NAVIGATION EVENT
                //if (!firstPositionFound) {
                //    $scope.updateToPosition = false;
                //    firstPositionFound = true;
                //}

            } else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                $scope.gettingLocationError = true;
            }


        });

        $scope.$on(events.NAVIGATION_STATE_EVENT, function (event, params) {

            $scope.forceToggleToHide = false;

            switch (params.eventType) {

                case events.NAVIGATION_STATE_EVENT_TYPES.NAVIGATION_ON:

                    $scope.zoomLevel = navigationZoomLevel;
                    $scope.updateToPosition = true;
                    $scope.forceToggleToHide = true;
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

            geoCoderService.reverse(geoParam).then(function (text) {

                switch (params.eventType) {

                    case events.MAP_EVENT_TYPES.OVERWRITE_START_POINT:

                        overwriteStartPoint(geoParam, text);
                        break;

                    case events.MAP_EVENT_TYPES.OVERWRITE_DESTINATION_POINT:

                        overwriteDestinationPoint(geoParam, text);
                        break;

                    case events.MAP_EVENT_TYPES.ADD_DESTINATION_POINT:

                        addDestinationPoint(geoParam, text);
                        break;

                    case events.MAP_EVENT_TYPES.ADD_WAY_POINT:

                        addWayPoint(geoParam, text);
                        break;

                    case events.MAP_EVENT_TYPES.AVOID_AREA:

                        addAreaToAvoid(geoParam, text);
                        break;

                    default:
                        break;
                }

                updateState();

            });

        });

        $scope.$watch(function () { return stateService.getSearchCriteria(); }, function (searchCriteria) {

            $scope.wayPoints = searchCriteria.wayPoints;
            $scope.areasToAvoid = searchCriteria.areasToAvoid;

        }, true);

        $scope.$watch(function () { return stateService.getRoutes(); }, function (routes) {

            $scope.routes = routes;

        }, true);

        $scope.pageReady = function () {

            $scope.ready = true;

            //$scope.updateToPosition = true;

            geoLocationService.watchPosition();
        };


}]);