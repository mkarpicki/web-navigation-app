/**
 * @todo
 * Think what to do when navigation ends on destination point:
 * - stateService empty?
 * - stateService remembered on load and restore on back?
 *
 * When stop navigation and click back
 * - restore?
 *
 * When click back when navigation
 * - ask to stop ?
 * -if yes then restore?
 */
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
            $scope.recalculating = false;

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

                    ///**
                    // * @todo check real position and if float remove that conversion
                    // */
                    //currentPosition.latitude = parseFloat(currentPosition.latitude);
                    //currentPosition.longitude = parseFloat(currentPosition.longitude);


                    if (positionNotChangedEnough(currentPosition, lastPosition)) {
                        return;
                    }

                    lastPosition = currentPosition;

                    //check if matched any wayPoint used for search to forget about it
                    wayPointsUsedForSearch = removeVisitedWayPoints(currentPosition, wayPointsUsedForSearch);

                    if (notOnRouteAnymore(currentPosition, $scope.route)) {

                        wayPointsUsedForSearch = addCurrentPositionAsNewStartPoint(wayPointsUsedForSearch, currentPosition);

                        $scope.recalculating = true;

                        routingService.calculateWithTrafficEnabled(wayPointsUsedForSearch, areasToAvoidUsedForSearch).then(function (routes) {

                            $scope.recalculating = false;

                            if (routes && routes.length > 0) {

                                var newRoute = routes[0];

                                newRoute.color = $scope.route.color;
                                stateService.setWayPoints(wayPointsUsedForSearch);

                                routingService.clearResults();
                                routingService.saveRoute(newRoute);
                                $scope.route = newRoute;

                                wayPointsUsedForSearch = getWayPointsWithoutStartPoint(wayPointsUsedForSearch);

                            }

                        }, function () {
                            $scope.recalculating = false;
                        });

                    }

                //} else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                }


            });

            var addCurrentPositionAsNewStartPoint = function (wayPoints, currentPosition) {

                wayPointsUsedForSearch.unshift({
                    title: '',
                    coordinates: currentPosition
                });

                return wayPointsUsedForSearch;
            };

            var getWayPointsWithoutStartPoint = function (wayPoints) {
                wayPoints.shift();
                return wayPoints;
            };

            var positionNotChangedEnough = function (currentPosition, lastPosition) {
                return (lastPosition && mapApiService.distance(currentPosition, lastPosition) <= minimumNumberOfMetersToCheckRouteState);
            };

            var notOnRouteAnymore = function (currentPosition, route) {
                return (calculateDistanceFromNearestRoutePoint(currentPosition, route) > metersFromRouteToRecalculate);
            };

            var removeVisitedWayPoints = function (currentPosition, wayPointsUsedForSearch) {

                wayPointsUsedForSearch = wayPointsUsedForSearch.filter(function (wayPoint) {
                    if (mapApiService.distance(currentPosition, wayPoint.coordinates) > numberOfMetersFromWayPointToAssumeVisited) {
                        return wayPoint;
                    }
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

                        var searchCriteria = stateService.getSearchCriteria();

                        //skip starting point and collect all important wayPoints
                        wayPointsUsedForSearch = getWayPointsWithoutStartPoint(angular.copy(searchCriteria.wayPoints));
                        areasToAvoidUsedForSearch = searchCriteria.areasToAvoid;

                        mapApiService.centerToRoute(route);
                        break;
                    }
                }

                if (!$scope.route) {
                    $scope.undefinedRoute = true;
                }

            };

            getRoute($routeParams.index);

        }]);