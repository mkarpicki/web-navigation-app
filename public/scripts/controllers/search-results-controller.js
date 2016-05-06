/**
 * @todo
 * - add back button
 */
angular.module('navigationApp.controllers').controller('SearchController',
    ["$scope", '$sce', 'routingService', 'colorThemesService', 'stateService', 'mapApiService',
        function($scope, $sce, routingService, colorThemesService, stateService, mapApiService) {

        'use strict';

        var alreadyFound = [];

        $scope.trustedText = function (text) {
            return $sce.trustAsHtml(text);
        };

        var reset = function () {
            $scope.routes = [];
            $scope.noRouteFound = false;
            $scope.notEnoughInformation = false;
        };

        var collectRoutes = function (routes, theme) {

            var route;

            if (!routes || routes.length === 0) {
                $scope.noRouteFound = true;
                return;
            }

            for (var i = 0, l = routes.length; i < l; i++) {

                route = routes[i];

                if (!alreadyFound[route.summary.text]) {

                    alreadyFound[route.summary.text] = route;

                    route.color = colorThemesService.getColor(theme);

                    stateService.addRoute(route);
                    $scope.routes.push(route);
                }

            }

            //$scope.routes = stateService.getRoutes();

            mapApiService.centerToRoute($scope.routes[0]);
        };

        var collectRoutesWithTrafficDisabled = function (routes) {
            collectRoutes(routes, colorThemesService.NEGATIVE_THEME);
        };

        var collectRoutesWithTrafficEnabled = function (routes) {
            collectRoutes(routes, colorThemesService.POSITIVE_THEME);
        };

        var collectRoutesBasedOnTraffic = function (ignoreTraffic) {
            return function (routes) {

                if (ignoreTraffic === true) {
                    return collectRoutesWithTrafficDisabled(routes);
                } else {
                    return collectRoutesWithTrafficEnabled(routes);
                }
            };
        };

        var setNoRouteFoundState = function () {
            $scope.noRouteFound = true;
        };

        var getRoute = function () {

            reset();

            $scope.routes = stateService.getRoutes() || [];

            var routesLength =  $scope.routes.length;

            if (routesLength > 0) {

                for (var i = 0; i < routesLength; i++) {
                    $scope.routes[i].hidden = false;
                }

                return;
            }

            //stateService.clearRoutes();

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
                (routingService.calculateWithTrafficDisabled(wayPoints, areasToAvoid)).then(collectRoutesBasedOnTraffic(true), setNoRouteFoundState);
                (routingService.calculateWithTrafficEnabled(wayPoints, areasToAvoid)).then(collectRoutesBasedOnTraffic(false), setNoRouteFoundState);
            } else {
                $scope.notEnoughInformation = true;
            }
        };

        getRoute();

    }]);