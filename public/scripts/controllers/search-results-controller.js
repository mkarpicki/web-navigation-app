angular.module('navigationApp.controllers').controller('SearchController',
    ["$scope", '$sce', 'routingService', 'colorThemesService', 'stateService', 'mapApiService',
        function($scope, $sce, routingService, colorThemesService, stateService, mapApiService) {

        'use strict';

        $scope.back = function () {
            stateService.back();
        };

        $scope.trustedText = function (text) {
            return $sce.trustAsHtml(text);
        };

        var reset = function () {
            $scope.routes = [];
            $scope.noRouteFound = false;
            $scope.notEnoughInformation = false;
        };

        var collectRoutes = function (routes, theme, wayPointsUsedForSearch, areasToAvoidUsedForSearch) {

            var route;

            if (!routes || routes.length === 0) {
                $scope.noRouteFound = true;
                return;
            }

            for (var i = 0, l = routes.length; i < l; i++) {

                route = routes[i];

                route.color = colorThemesService.getColor(theme);
                route.wayPointsUsedForSearch = wayPointsUsedForSearch;
                route.areasToAvoidUsedForSearch = areasToAvoidUsedForSearch;

                routingService.saveRoute(route);
            }

            $scope.routes = routingService.getResults();

            mapApiService.centerToRoute($scope.routes[0]);
        };

        var collectRoutesWithTrafficDisabled = function (routes, wayPointsUsedForSearch, areasToAvoidUsedForSearch) {
            collectRoutes(routes, colorThemesService.NEGATIVE_THEME, wayPointsUsedForSearch, areasToAvoidUsedForSearch);
        };

        var collectRoutesWithTrafficEnabled = function (routes, wayPointsUsedForSearch, areasToAvoidUsedForSearch) {
            collectRoutes(routes, colorThemesService.POSITIVE_THEME, wayPointsUsedForSearch, areasToAvoidUsedForSearch);
        };

        var collectRoutesBasedOnTraffic = function (ignoreTraffic, wayPointsUsedForSearch, areasToAvoidUsedForSearch) {
            return function (routes) {

                if (ignoreTraffic === true) {
                    return collectRoutesWithTrafficDisabled(routes, wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                } else {
                    return collectRoutesWithTrafficEnabled(routes, wayPointsUsedForSearch, areasToAvoidUsedForSearch);
                }
            };
        };

        var setNoRouteFoundState = function () {
            $scope.noRouteFound = true;
        };

        var getRoute = function () {

            reset();

            routingService.clearResults();

            var deSerializedQuery = stateService.getSearchCriteria(),
                wayPoints = deSerializedQuery.wayPoints,
                areasToAvoid = deSerializedQuery.areasToAvoid;

            wayPoints = wayPoints.filter(function (wayPoints) {
                var coordinates = wayPoints.coordinates;
                return (coordinates && coordinates.latitude && coordinates.longitude);
            });

            areasToAvoid = areasToAvoid.filter(function (areaToAvoid) {
                return (areaToAvoid.boundingBox);
            });

            if (wayPoints.length > 1) {
                (routingService.calculateWithTrafficDisabled(wayPoints, areasToAvoid)).then(collectRoutesBasedOnTraffic(true, wayPoints, areasToAvoid), setNoRouteFoundState);
                (routingService.calculateWithTrafficEnabled(wayPoints, areasToAvoid)).then(collectRoutesBasedOnTraffic(false, wayPoints, areasToAvoid), setNoRouteFoundState);
            } else {
                $scope.notEnoughInformation = true;
            }
        };

        getRoute();

    }]);