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

        var collectRoutes = function (routes, theme) {

            if (!routes || routes.length === 0) {
                $scope.noRouteFound = true;
            }

            for (var i = 0, l = routes.length; i < l; i++) {
                routes[i].color = colorThemesService.getColor(theme);
                routingService.saveRoute(routes[i]);
            }

            $scope.routes = routingService.getResults();
        };

        var collectRoutesWithTrafficDisabled = function (routes) {
            collectRoutes(routes, colorThemesService.NEGATIVE_THEME);
        };

        var collectRoutesWithTrafficEnabled = function (routes) {
            collectRoutes(routes, colorThemesService.POSITIVE_THEME);
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

            (routingService.calculateWithTrafficDisabled(waypoints)).then(collectRoutesWithTrafficDisabled);
            (routingService.calculateWithTrafficEnabled(waypoints)).then(collectRoutesWithTrafficEnabled);
        };

        getRoute();

    }]);