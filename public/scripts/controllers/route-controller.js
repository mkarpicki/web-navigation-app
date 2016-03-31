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

                if (!$scope.driveModeEnabled) {
                    return;
                }

                if (params.eventType === events.POSITION_EVENT_TYPES.CHANGE) {

                    var geoPosition = params.param;

                    var currentPosition = {
                        latitude : geoPosition.coords.latitude,
                        longitude : geoPosition.coords.longitude
                    };

                    /**
                     * @todo check real position and if float remove that conversion
                     */
                    //currentPosition.latitude = parseFloat(currentPosition.latitude);
                    //currentPosition.longitude = parseFloat(currentPosition.longitude);


                    if (positionNotChangedEnough(currentPosition, lastPosition)) {
                        return;
                    }

                    lastPosition = currentPosition;

                    //check if matched any wayPoint used for search to forget about it
                    wayPointsUsedForSearch = removeVisitedWayPoints(currentPosition, wayPointsUsedForSearch);

                    if (notOnRouteAnymore(currentPosition, $scope.route)) {

                        wayPointsUsedForSearch.unshift(currentPosition);

                        var wayPointsToUse = prepareWayPointsToUseAsStrings(wayPointsUsedForSearch);
                        var areasToUse = prepareAreasToUseAsStrings(areasToAvoidUsedForSearch);

                        routingService.calculateWithTrafficEnabled(wayPointsToUse, areasToUse).then(function (routes) {

                            if (routes && routes.length > 0) {

                                var newRoute = routes[0];

                                newRoute.color = $scope.route.color;
                                newRoute.wayPointsUsedForSearch = wayPointsUsedForSearch;
                                newRoute.areasToAvoidUsedForSearch = areasToAvoidUsedForSearch;

                                routingService.clearResults();
                                routingService.saveRoute(newRoute);
                                $scope.route = newRoute;

                                wayPointsUsedForSearch = $scope.route.wayPointsUsedForSearch.slice(1, $scope.route.length);

                            }

                        });

                    }

                //} else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                }


            });

            var prepareAreasToUseAsStrings = function (areasToUse) {
                return areasToUse.map(function (area) {
                    var boundingBox = area.boundingBox,
                        topLeft = boundingBox.topLeft,
                        bottomRight = boundingBox.bottomRight;

                    return (topLeft.latitude + "," + topLeft.longitude + ";" + bottomRight.latitude + "," + bottomRight.longitude);
                });
            };

            var prepareWayPointsToUseAsStrings = function (wayPointsToUse) {
                return wayPointsToUse.map(function (wayPoint) {
                    return (wayPoint.latitude + "," + wayPoint.longitude);
                });
            };

            var positionNotChangedEnough = function (currentPosition, lastPosition) {
                return (lastPosition && mapApiService.distance(currentPosition, lastPosition) <= minimumNumberOfMetersToCheckRouteState);
            };

            var notOnRouteAnymore = function (currentPosition, route) {
                return (calculateDistanceFromNearestRoutePoint(currentPosition, route) > metersFromRouteToRecalculate);
            };

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
                    wayPointsUsedForSearch = $scope.route.wayPointsUsedForSearch.slice(1, $scope.route.length);
                    areasToAvoidUsedForSearch = $scope.route.areasToAvoidUsedForSearch;
                }

            };

            getRoute($routeParams.index);

        }]);