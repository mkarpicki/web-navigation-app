angular.module('navigationApp.controllers').controller('SearchController',
    ["$scope", '$sce', '$location', "routingService", 'colorThemesService', function($scope, $sce, $location, routingService, colorThemesService) {

        'use strict';

        $scope.selectRoute = function (route) {
            console.log(route);
            //$scope.routes = [];
            //$scope.routes[0] = route;

        };

        $scope.routes = [];

        $scope.trustedText = function (text) {
            return $sce.trustAsHtml(text);
        };

        var collectRoutes = function (routes, theme) {

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

            while(true) {
                waypoint = $location.search()['waypoint' + i];

                if (!waypoint) {
                    break;
                }
                i++;
                waypoints.push(waypoint);
            }

            if (waypoints.length < 2) {
                alert('no waypoints to find');
                return;
            }

            routingService.clearResults();

            (routingService.calculateWithTrafficDisabled(waypoints)).then(collectRoutesWithTrafficDisabled);
            (routingService.calculateWithTrafficEnabled(waypoints)).then(collectRoutesWithTrafficEnabled);
        };

        getRoute();

    }]);