/**
 * @todo
 * when click back then ask if user is sure
 * and then stop navigation mode
 */
angular.module('navigationApp.controllers').controller('NavigationController',
    ['$scope', '$sce', '$routeParams', 'config', 'events', 'routingService', 'stateService', 'mapApiService',
        function($scope, $sce, $routeParams, config, events, routingService, stateService, mapApiService) {

            'use strict';

            var visitedWayPoints = [],

                metersFromRouteToRecalculate = config.NUMBER_OF_METERS_FROM_ROUTE_TO_RECALCULATE,
                minimumNumberOfMetersToCheckRouteState = config.NUMBER_OF_METERS_OF_POSITION_CHANGED_TO_REACT,
                numberOfMetersFromWayPointToAssumeVisited = config.NUMBER_OF_METERS_FROM_WAY_POINT_TO_MARK_AS_VISITED,
                lastPosition = null,

                areasToAvoidUsedForSearch = [],
                wayPointsUsedForSearch = [];

            $scope.route = null;
            $scope.undefinedRoute = false;
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

            $scope.$on('$locationChangeStart', function( event ) {
                var answer = confirm("Are you sure you want to stop navigation?");
                if (!answer) {
                    event.preventDefault();
                } else {
                    disableDriveMode();
                }
            });


            var onPositionChange = function (event, params) {

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

                    checkRouteProgress(currentPosition);

                    //} else if (params.eventType === events.POSITION_EVENT_TYPES.ERROR) {

                }


            };

            var checkRouteProgress = function (currentPosition) {

                lastPosition = currentPosition;

                console.log('wayPointsUsedForSearch');
                console.log(wayPointsUsedForSearch);

                var justVisitedWayPoints = findJustVisitedWayPoints(currentPosition, wayPointsUsedForSearch);

                if (justVisitedWayPoints.length > 0) {
                    visitedWayPoints = collectVisitedWayPoints(visitedWayPoints, justVisitedWayPoints);
                }

                console.log('visitedWayPoints');
                console.log(visitedWayPoints);

                if (notOnRouteAnymore(currentPosition, $scope.route)) {

                    var wayPointsToSearch = getOnlyNotVisitedWayPoints(wayPointsUsedForSearch, visitedWayPoints);

                    console.log('wayPointsToSearch');
                    console.log(wayPointsToSearch);

                    wayPointsToSearch = addCurrentPositionAsNewStartPoint(wayPointsToSearch, currentPosition);

                    console.log('addCyrrentPos wayPointsToSearch');
                    console.log(wayPointsToSearch);
                    console.log(wayPointsToSearch.length);

                    $scope.recalculating = true;

                    routingService.calculateWithTrafficEnabled(wayPointsToSearch, areasToAvoidUsedForSearch).then(function (routes) {

                        $scope.recalculating = false;

                        if (routes && routes.length > 0) {

                            var newRoute = routes[0];

                            $scope.route.hidden = true;
                            newRoute.color = $scope.route.color;

                            $scope.route = newRoute;

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
                        break;
                    }
                }

                return nearestPoint;
            };

            var enableDriveMode = function () {
                stateService.enableNavigationMode();
            };

            /**
             * add it onleave
             */
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

                routes = routingService.getResults();

                for (var i = 0, len = routes.length; i < len; i++) {

                    if (i === nIndex) {
                        route = routes[i];
                    }
                }

                if (route) {
                    $scope.route = route;

                    $scope.$on(events.POSITION_EVENT, onPositionChange);

                    enableDriveMode();
                    //mapApiService.centerToRoute(route);
                } else {
                    $scope.undefinedRoute = true;
                }

            };

            getRoute($routeParams.index);

        }]);