angular.module('navigationApp.controllers').controller('PageController',
    ["$rootScope", "$scope", '$location', '$q', 'events', 'routingService', 'stateService', 'geoLocationService', 'geoCoderService', 'dataModelService', function($rootScope, $scope, $location, $q, events, routingService, stateService, geoLocationService, geoCoderService, dataModelService) {

        'use strict';

        var defaultZoomLevel = 14,
            navigationZoomLevel = 16,
            firstPositionFound = false;

        //set by default true to center map on first found position
        $scope.updateToPosition = true;
        $scope.zoomLevel = defaultZoomLevel;

        $rootScope.currentPosition = {
            latitude: 52.51083,
            longitude: 13.45264
        };

        $scope.wayPoints = null;
        $scope.areasToAvoid = null;

        $scope.routes = null;

        $scope.gettingLocationError = false;
        $scope.ready = false;


        //var apply = function () {
        //    routingService.clearResults();
        //    $scope.$apply();
        //};


        var overwriteStartPoint = function (point, text) {

            stateService.overwriteStartPoint(dataModelService.getWayPoint(text, [], point));

        };

        var overwriteDestinationPoint = function (point, text) {

            stateService.overwriteDestinationPoint(dataModelService.getWayPoint(text, [], point));

        };

        var addDestinationPoint = function (point, text) {

            stateService.addDestinationPoint(dataModelService.getWayPoint(text, [], point));

        };

        var addWayPoint = function (point, text) {

            stateService.addWayPoint(dataModelService.getWayPoint(text, [], point));

        };

        var addAreaToAvoid = function (geoParam, text) {

            /**
             * @todo
             * think about usage of dataModelService here but then object with params should be passed and same for wayPoint instead of coordinates as string
             * @type {{boundingBox: string, text: *}}
             */
            var item = {
                boundingBox : geoParam.topLeft.latitude + "," + geoParam.topLeft.longitude + ";" + geoParam.bottomRight.latitude + "," + geoParam.bottomRight.longitude,
                text: text
            };

            stateService.addAreaToAvoid(item);

        };

        var updateState = function () {

            var query = stateService.serializeQuery();

            $location.url('/?' + query);
            routingService.clearResults();
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

                $rootScope.currentPosition = {
                    latitude : geoPosition.coords.latitude,
                    longitude : geoPosition.coords.longitude
                };

                $scope.$apply();

                //on first found position map was updated
                //reset value to stop updating it
                //it may be turned on again by NAVIGATION EVENT
                if (!firstPositionFound) {
                    $scope.updateToPosition = false;
                    firstPositionFound = true;
                }

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

            var geoParam = params.geoParam,
                point = geoParam.latitude + ',' + geoParam.longitude;

            geoCoderService.reverse(point).then(function (text) {

                switch (params.eventType) {

                    case events.MAP_EVENT_TYPES.OVERWRITE_START_POINT:

                        overwriteStartPoint(point, text);
                        break;

                    case events.MAP_EVENT_TYPES.OVERWRITE_DESTINATION_POINT:

                        overwriteDestinationPoint(point, text);
                        break;

                    case events.MAP_EVENT_TYPES.ADD_DESTINATION_POINT:

                        addDestinationPoint(point, text);
                        break;

                    case events.MAP_EVENT_TYPES.ADD_WAY_POINT:

                        addWayPoint(point, text);
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

        $scope.$watch(function () { return stateService.getSearchCriteriaAsObjects(); }, function (searchCriteria) {

            $scope.wayPoints = searchCriteria.wayPoints;
            $scope.areasToAvoid = searchCriteria.areasToAvoid;

        }, true);

        $scope.$watch(function () { return routingService.getResults(); }, function (routes) {

            $scope.routes = routes;

        }, true);

        $scope.pageReady = function () {

            $scope.ready = true;

            //$scope.updateToPosition = true;

            geoLocationService.watchPosition();
        };


}]);