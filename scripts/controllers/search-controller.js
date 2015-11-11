angular.module('navigationApp.controllers').controller('SearchController',
    ["$scope", '$sce', '$location', '$window', "routingService", 'colorThemesService',
        function($scope, $sce, $location, $window, routingService, colorThemesService) {

        'use strict';

        $scope.selectRoute = function (index) {
            $location.url('/route/' + index );
        };

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

        var prepareWaypoints = function (waypoints) {

            var points = [],
                p;

            for (var i = 0, l = waypoints.length; i < l; i++) {

                p = waypoints[i].split(',');

                points.push({
                    latitude : p[0],
                    longitude : p[1]
                });
            }

            return points;
        };

        var collectRoutes = function (routes, theme, waypointsUsedForSearch) {

            var route;

            if (!routes || routes.length === 0) {
                $scope.noRouteFound = true;
            }

            waypointsUsedForSearch = prepareWaypoints(waypointsUsedForSearch);

            for (var i = 0, l = routes.length; i < l; i++) {

                route = routes[i];

                route.color = colorThemesService.getColor(theme);
                route.waypointsUsedForSearch = waypointsUsedForSearch;

                routingService.saveRoute(route);
            }

            $scope.routes = routingService.getResults();
        };

        var collectRoutesWithTrafficDisabled = function (routes, waypointsUsedForSearch) {
            collectRoutes(routes, colorThemesService.NEGATIVE_THEME, waypointsUsedForSearch);
        };

        var collectRoutesWithTrafficEnabled = function (routes, waypointsUsedForSearch) {
            collectRoutes(routes, colorThemesService.POSITIVE_THEME, waypointsUsedForSearch);
        };

        var collectRoutesBasedOnTraffic = function (ignoreTraffic, waypointsUsedForSearch) {
            return function (routes) {

                if (ignoreTraffic === true) {
                    return collectRoutesWithTrafficDisabled(routes,waypointsUsedForSearch);
                } else {
                    return collectRoutesWithTrafficEnabled(routes, waypointsUsedForSearch);
                }
            };
        };

        var getRoute = function () {

            var waypoints = [],
                waypoint,
                i = 0;

            reset();

            routingService.clearResults();

            while(true) {
                waypoint = $location.search()['waypoint' + i];

                if (!waypoint) {
                    break;
                }
                i++;
                waypoints.push(waypoint);
            }

            if (waypoints.length < 2) {
                $scope.notEnoughInformation = true;
                return;
            }

            (routingService.calculateWithTrafficDisabled(waypoints)).then(collectRoutesBasedOnTraffic(true, waypoints));
            (routingService.calculateWithTrafficEnabled(waypoints)).then(collectRoutesBasedOnTraffic(false, waypoints));
        };

        getRoute();

    }]);