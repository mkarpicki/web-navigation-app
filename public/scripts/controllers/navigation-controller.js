angular.module('navigationApp.controllers').controller('NavigationController',
    ['$scope', '$sce', '$routeParams', 'config', 'events', 'routingService', 'stateService', 'mapApiService', 'maneuversService', '$window',
        function($scope, $sce, $routeParams, config, events, routingService, stateService, mapApiService, maneuversService, $window) {

            'use strict';

            var visitedWayPoints = [],
                searchCriteria = null,

                metersFromRouteToRecalculate = config.NUMBER_OF_METERS_FROM_ROUTE_TO_RECALCULATE,
                minimumNumberOfMetersToCheckRouteState = config.NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT,
                numberOfMetersFromWayPointToAssumeVisited = config.NUMBER_OF_METERS_FROM_WAY_POINT_TO_MARK_AS_VISITED,
                lastPosition = null,

                areasToAvoidUsedForSearch = [],
                wayPointsUsedForSearch = [],

                originalRoutes = [],

                forceLeave = false;

            $scope.route = null;
            $scope.undefinedRoute = false;
            $scope.recalculating = false;
            $scope.onLeaveConfirmation = false;
            $scope.maneuvers = null;
            $scope.currentSpeed = 0;
            $scope.speedLimit = 0;
            
            $scope.trustedText = function (text) {
                return $sce.trustAsHtml(text);
            };

            $scope.cancel = function () {
                $scope.onLeaveConfirmation = false;
            };

            $scope.confirm = function () {
                forceLeave = true;
                onLeave(null);
                $window.history.back();
            };

            $scope.isNextManeuver = function (index) {
                if (index === 0) {
                    return !isManeuverVisited(index);
                }
                return !isManeuverVisited(index) && isManeuverVisited(index - 1);
            };

            var isManeuverVisited = function (index) {
                return ($scope.maneuvers[index].visited);
            };

            var onLeave = function (event) {

                /**
                 * @todo
                 * clear routes
                 * and add only those that were in state service during init (to not have too many routes)
                 */

                if (!forceLeave) {
                    $scope.onLeaveConfirmation = true;
                    event.preventDefault();
                    return;
                }
                stateService.clearRoutes();
                stateService.saveRoutes(originalRoutes);
                disableDriveMode();
            };

            var updateSpeedLimit = function (wayPoint) {

                routingService.getRouteInfo(wayPoint).then(function (link) {

                    if (link && link[0]) {
                        $scope.speedLimit = link[0].speedLimit;
                    }
                });

            };

            var getManeuvers = function (route) {
                return maneuversService.getRouteManeuvers(route);
            };

            var onPositionChange = function (event, params) {

                if (params.eventType === events.POSITION_EVENT_TYPES.CHANGE) {

                    var geoPosition = params.param;

                    var currentPosition = {
                        latitude : geoPosition.coords.latitude,
                        longitude : geoPosition.coords.longitude
                    };

                    $scope.currentSpeed = geoPosition.coords.speed;

                    ///**
                    // * @todo check real position and if float remove that conversion
                    // */
                    //currentPosition.latitude = parseFloat(currentPosition.latitude);
                    //currentPosition.longitude = parseFloat(currentPosition.longitude);


                    if (positionNotChangedEnough(currentPosition, lastPosition)) {
                        return;
                    }

                    checkRouteProgress(currentPosition);

                    //} else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                }


            };

            var checkRouteProgress = function (currentPosition) {

                /**
                 * @todo
                 * cut visible route on map to hide what I already went thru
                 */

                lastPosition = currentPosition;

                var justVisitedWayPoints = findJustVisitedWayPoints(currentPosition, wayPointsUsedForSearch);

                if (justVisitedWayPoints.length > 0) {
                    updateSpeedLimit(currentPosition);
                    visitedWayPoints = collectVisitedWayPoints(visitedWayPoints, justVisitedWayPoints);
                    /**
                     * @todo
                     * - hide visited way points on map
                     * - when loading each page - reset visibility of objects (to show all)
                     *
                     */
                }

                $scope.maneuvers = findCurrentManeuver(currentPosition, $scope.maneuvers);

                if (notOnRouteAnymore(currentPosition, $scope.route)) {

                    updateSpeedLimit(currentPosition);

                    var wayPointsToSearch = getOnlyNotVisitedWayPoints(wayPointsUsedForSearch, visitedWayPoints);

                    wayPointsToSearch = addCurrentPositionAsNewStartPoint(wayPointsToSearch, currentPosition);

                    $scope.recalculating = true;

                    routingService.calculateWithTrafficEnabled(wayPointsToSearch, areasToAvoidUsedForSearch).then(function (routes) {

                        $scope.recalculating = false;

                        if (routes && routes.length > 0) {

                            var newRoute = routes[0];

                            $scope.route.hidden = true;
                            newRoute.color = $scope.route.color;
                            //newRoute.color = 'black';

                            stateService.addRoute(newRoute);
                            $scope.route = newRoute;
                            $scope.maneuvers = getManeuvers($scope.route);

                            wayPointsUsedForSearch = getWayPointsWithoutStartPoint(angular.copy(wayPointsToSearch));
                        }

                    }, function () {
                        $scope.recalculating = false;
                    });

                }

            };

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

            /**
             * @todo
             * extend check to detect if going in proper direction
             */
            var notOnRouteAnymore = function (currentPosition, route) {
                return (calculateDistanceFromNearestRoutePoint(currentPosition, route) > metersFromRouteToRecalculate);
            };

            var setManeuverAsVisited = function (maneuver) {
                maneuver.visited = true;
            };

            var findCurrentManeuver = function (currentPosition, maneuvers) {

                var position = 0;

                for (var i = 0, len = maneuvers.length; i < len; i++) {

                    var distance = mapApiService.distance(currentPosition, maneuvers[i].position);

                    if (distance <= numberOfMetersFromWayPointToAssumeVisited) {
                        updateSpeedLimit(currentPosition);
                        setManeuverAsVisited(maneuvers[i]);
                        position = i;
                        break;
                    }
                }

                for (var j = 0 ; j < position; j++) {
                    setManeuverAsVisited(maneuvers[j]);
                }

                return maneuvers;
            };

            var findJustVisitedWayPoints = function (currentPosition, wayPointsUsedForSearch) {

                var justVisitedWayPoints = wayPointsUsedForSearch.filter(function (wayPoint) {
                    if (mapApiService.distance(currentPosition, wayPoint.coordinates) <= numberOfMetersFromWayPointToAssumeVisited) {
                        return wayPoint;
                    }
                });

                return justVisitedWayPoints;

            };

            /**
             * @todo
             * improve implementation.
             * currently if points of route are more then number of meters from config
             * then recalculation may be called when not needed.
             *
             * Ideally: check if position on line between 2 points
             */
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
                        route.shape.splice(0, i);
                        break;
                    }
                }

                return nearestPoint;
            };

            var enableDriveMode = function () {
                stateService.enableNavigationMode();
            };

            var disableDriveMode = function () {
                stateService.disableNavigationMode();
            };

            var getRoute = function (index) {

                var nIndex = parseInt(index, 10),
                    routes,
                    route;

                if (isNaN(nIndex)) {
                    $scope.undefinedRoute = true;
                    return;
                }

                routes = stateService.getRoutes();
                originalRoutes = angular.copy(routes);

                for (var i = 0, len = routes.length; i < len; i++) {

                    if (i === nIndex) {
                        route = routes[i];
                    }
                }

                if (route) {
                    $scope.route = route;
                    $scope.maneuvers = getManeuvers($scope.route);

                    searchCriteria = angular.copy(stateService.getSearchCriteria());
                    wayPointsUsedForSearch = getWayPointsWithoutStartPoint(searchCriteria.wayPoints);
                    areasToAvoidUsedForSearch = searchCriteria.areasToAvoid;

                    $scope.$on(events.POSITION_EVENT, onPositionChange);
                    $scope.$on('$locationChangeStart', onLeave);

                    enableDriveMode();
                } else {
                    $scope.undefinedRoute = true;
                }

            };

            getRoute($routeParams.index);

        }]);