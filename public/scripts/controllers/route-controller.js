/**
 * @todo
 * when click back then ask if user is sure
 * and then stop navigation mode
 */
angular.module('navigationApp.controllers').controller('RouteController',
    ['$scope', '$sce', '$routeParams', 'events', 'routingService', 'stateService', 'mapApiService',
        function($scope, $sce, $routeParams, events, routingService, stateService, mapApiService) {

            'use strict';

            var visitedWayPoints = [],
                searchCriteria = null,

                metersFromRouteToRecalculate = 10,
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

                    var justVisitedWayPoints = findJustVisitedWayPoints(currentPosition, wayPointsUsedForSearch);

                    if (justVisitedWayPoints.length > 0) {
                        visitedWayPoints = collectVisitedWayPoints(visitedWayPoints, justVisitedWayPoints);
                    }

                    if (notOnRouteAnymore(currentPosition, $scope.route)) {

                        var wayPointsToSearch = getOnlyNotVisitedWayPoints(wayPointsUsedForSearch, visitedWayPoints);

                        wayPointsToSearch = addCurrentPositionAsNewStartPoint(wayPointsToSearch, currentPosition);

                        $scope.recalculating = true;

                        routingService.calculateWithTrafficEnabled(wayPointsToSearch, areasToAvoidUsedForSearch).then(function (routes) {

                            $scope.recalculating = false;

                            if (routes && routes.length > 0) {

                                var newRoute = routes[0];

                                newRoute.color = $scope.route.color;

                                routingService.clearResults();
                                routingService.saveRoute(newRoute);
                                $scope.route = newRoute;

                                wayPointsUsedForSearch = getWayPointsWithoutStartPoint(angular.copy(wayPointsToSearch));
                            }

                        }, function () {
                            $scope.recalculating = false;
                        });

                    }

                //} else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                }


            });

            var getOnlyNotVisitedWayPoints = function (allWayPoints, visitedWayPoints) {

                var notVisitedWayPoints = allWayPoints.filter(function (wayPoint) {
                    var found = visitedWayPoints.filter(function (visitedWayPoint) {
                        return visitedWayPoint === wayPoint;
                    });

                    return found.length === 0;
                });

                return notVisitedWayPoints;

            };

            var collectVisitedWayPoints = function (visitedWayPoints, justVisitedWayPoints) {
                visitedWayPoints = visitedWayPoints.concat(justVisitedWayPoints);
                return visitedWayPoints;
            };

            var addCurrentPositionAsNewStartPoint = function (wayPoints, currentPosition) {

                wayPoints.unshift({
                    title: '',
                    coordinates: currentPosition
                });

                return wayPoints;
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

            var findJustVisitedWayPoints = function (currentPosition, wayPointsUsedForSearch) {

                var justVisitedWayPoints = wayPointsUsedForSearch.filter(function (wayPoint) {
                    if (mapApiService.distance(currentPosition, wayPoint.coordinates) <= numberOfMetersFromWayPointToAssumeVisited) {
                        return wayPoint;
                    }
                });

                return justVisitedWayPoints;

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

                        searchCriteria = angular.copy(stateService.getSearchCriteria());

                        wayPointsUsedForSearch = getWayPointsWithoutStartPoint(searchCriteria.wayPoints);
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