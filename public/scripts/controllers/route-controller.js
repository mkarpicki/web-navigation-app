angular.module('navigationApp.controllers').controller('RouteController',
    ['$scope', '$sce', '$routeParams', 'events', 'routingService', 'stateService', 'mapApiService',
        function($scope, $sce, $routeParams, events, routingService, stateService, mapApiService) {

            'use strict';

            var metersFromRouteToRecalculate = 10,
                minimumNumberOfMetersToCheckRouteState = 5,
                numberOfMetersFromWayPointToAssumeVisited = 30,
                lastPosition = null,

                areasToAvoidUsedForSearch = [],
                wayPointsUsedForSearch = [];

            $scope.route = null;
            $scope.undefinedRoute = false;
            $scope.driveModeEnabled = false;

            $scope.getManeuver = function () {
                var maneuver = [];

                if ($scope.route && $scope.route.leg && $scope.route.leg[0]) {
                    maneuver =  $scope.route.leg[0].maneuver;
                }

                return maneuver;
            };

            $scope.trustedText = function (text) {
                return $sce.trustAsHtml(text);
            };

            $scope.enableDriveMode = function () {
                $scope.driveModeEnabled = true;
                stateService.enableNavigationMode();
            };

            $scope.disableDriveMode = function () {
                $scope.driveModeEnabled = false;
                stateService.disableNavigationMode();
            };

            $scope.back = function () {
                stateService.back();
            };

            $scope.$on(events.POSITION_EVENT, function (event, params) {

                if (params.eventType === events.POSITION_EVENT_TYPES.CHANGE) {

                    var geoPosition = params.param;

                    var currentPosition = {
                        latitude : geoPosition.coords.latitude,
                        longitude : geoPosition.coords.longitude
                    };

                    /**
                     * @check real position and if float remove that conversion
                     * @type {Number}
                     */
                    currentPosition.latitude = parseFloat(currentPosition.latitude);
                    currentPosition.longitude = parseFloat(currentPosition.longitude);


                    if (lastPosition && mapApiService.distance(currentPosition, lastPosition) <= minimumNumberOfMetersToCheckRouteState) {
                        return;
                    }

                    lastPosition = currentPosition;

                    //check if matched any wayPoint used for search to forget about it
                    wayPointsUsedForSearch = removeVisitedWayPoints(currentPosition, wayPointsUsedForSearch);

                    if (calculateDistanceFromNearestRoutePoint(currentPosition, $scope.route) > metersFromRouteToRecalculate) {
                        //console.log('not on route anymore!');
                        //2a. if not recalculate route (same waypoints, areas etc) BUT ignore waypoints I passed already
                        //2b. calculate route to nearest point on original route?
                    }

                //} else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                }


            });

            var removeVisitedWayPoints = function (currentPosition, wayPointsUsedForSearch) {

                wayPointsUsedForSearch = wayPointsUsedForSearch.filter(function (wayPoint) {
                    return (mapApiService.distance(currentPosition, wayPoint) > numberOfMetersFromWayPointToAssumeVisited);
                });

                return wayPointsUsedForSearch;
            };

            var calculateDistanceFromNearestRoutePoint = function (position, route) {

                var nearestPoint = null;

                for (var i = 0, len = route.shape.length; i < len; i++) {

                    var item = route.shape[i],
                        values = item.split(','),
                        routePointPosition = {
                            latitude: parseFloat(values[0]),
                            longitude: parseFloat(values[1])
                        };

                    var distance = mapApiService.distance(position, routePointPosition);

                    if (nearestPoint === null || nearestPoint > distance) {
                        nearestPoint = distance;
                    }

                    if (nearestPoint <= metersFromRouteToRecalculate) {
                        break;
                    }
                }

                return nearestPoint;
            };

            var getRoute = function (index) {

                var nIndex = parseInt(index, 10);

                if (isNaN(nIndex)) {
                    $scope.undefinedRoute = true;
                    return;
                }

                var routes = routingService.getResults(),
                    route;

                routingService.clearResults();

                for (var i = 0, l = routes.length; i < l; i++) {

                    route = routes[i];

                    if (i === nIndex) {

                        $scope.route = route;
                        routingService.saveRoute(route);
                        break;
                    }
                }

                if (!$scope.route) {
                    $scope.undefinedRoute = true;
                } else {
                    //skip starting point and collect all important wayPoints
                    wayPointsUsedForSearch = $scope.route.wayPointsUsedForSearch.slice(1,$scope.route.length);
                    areasToAvoidUsedForSearch = $scope.route.areasToAvoidUsedForSearch;
                }

                //console.log($scope.route);

            };

            getRoute($routeParams.index);

        }]);