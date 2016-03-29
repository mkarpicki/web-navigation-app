angular.module('navigationApp.controllers').controller('SearchController',
    ["$scope", '$sce', '$location', '$window', 'routingService', 'colorThemesService', 'stateService',
        function($scope, $sce, $location, $window, routingService, colorThemesService, stateService) {

        'use strict';

        $scope.back = function () {
            $window.history.back();
        };

        $scope.trustedText = function (text) {
            return $sce.trustAsHtml(text);
        };

        var reset = function () {
            $scope.routes = [];
            $scope.noRouteFound = false;
            $scope.notEnoughInformation = false;
        };

        var prepareWayPoints = function (wayPoints) {

            var points = [],
                p;

            for (var i = 0, l = wayPoints.length; i < l; i++) {

                p = wayPoints[i].split(',');

                points.push({
                    latitude : p[0],
                    longitude : p[1]
                });
            }

            return points;
        };

        var collectRoutes = function (routes, theme, wayPointsUsedForSearch) {

            var route;

            if (!routes || routes.length === 0) {
                $scope.noRouteFound = true;
                return;
            }

            wayPointsUsedForSearch = prepareWayPoints(wayPointsUsedForSearch);

            for (var i = 0, l = routes.length; i < l; i++) {

                route = routes[i];

                route.color = colorThemesService.getColor(theme);
                route.waypointsUsedForSearch = wayPointsUsedForSearch;

                routingService.saveRoute(route);
            }

            $scope.routes = routingService.getResults();
        };

        var collectRoutesWithTrafficDisabled = function (routes, wayPointsUsedForSearch) {
            collectRoutes(routes, colorThemesService.NEGATIVE_THEME, wayPointsUsedForSearch);
        };

        var collectRoutesWithTrafficEnabled = function (routes, wayPointsUsedForSearch) {
            collectRoutes(routes, colorThemesService.POSITIVE_THEME, wayPointsUsedForSearch);
        };

        var collectRoutesBasedOnTraffic = function (ignoreTraffic, wayPointsUsedForSearch) {
            return function (routes) {

                if (ignoreTraffic === true) {
                    return collectRoutesWithTrafficDisabled(routes, wayPointsUsedForSearch);
                } else {
                    return collectRoutesWithTrafficEnabled(routes, wayPointsUsedForSearch);
                }
            };
        };

        var getRoute = function () {

            reset();

            routingService.clearResults();

            var deSerializedQuery = stateService.deserializeQuery(),
                wayPoints = deSerializedQuery.wayPoints.map(function (wayPoint) {
                    return wayPoint.coordinates;
                }),
                areasToAvoid = deSerializedQuery.areasToAvoid.map(function (areaToAvoid) {
                    return areaToAvoid.boundingBox;
                });

            wayPoints = wayPoints.filter(function (coordinate) {
                return (coordinate !== "" && coordinate !== null);
            });

            if (wayPoints.length > 1) {
                (routingService.calculateWithTrafficDisabled(wayPoints, areasToAvoid)).then(collectRoutesBasedOnTraffic(true, wayPoints));
                (routingService.calculateWithTrafficEnabled(wayPoints, areasToAvoid)).then(collectRoutesBasedOnTraffic(false, wayPoints));
            } else {
                $scope.notEnoughInformation = true;
            }
        };

        getRoute();

    }]);