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

        var prepareAreasToAvoid = function (areasToAvoid) {

            var areas = [],
                corners,
                c1, c2,
                boundingBox;

            for (var i = 0, len = areasToAvoid.length; i < len; i++) {

                corners = areasToAvoid[i].split(';');

                c1 = corners[0].split(',');
                c2 = corners[1].split(',');

                boundingBox = {
                    topLeft: { latitude: c1[0], longitude: c1[1] },
                    bottomRight: { latitude: c2[0], longitude: c2[1] }
                };

                areas.push({
                    boundingBox: boundingBox
                })
            }

            return areas;
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

        var collectRoutes = function (routes, theme, wayPointsUsedForSearch, areasToAvoidUsedForSearch) {

            var route;

            if (!routes || routes.length === 0) {
                $scope.noRouteFound = true;
                return;
            }

            //wayPointsUsedForSearch = prepareWayPoints(wayPointsUsedForSearch);
            //areasToAvoidUsedForSearch = prepareAreasToAvoid(areasToAvoidUsedForSearch);

            /**
             * @todo remove it and listen to markers separately
             * @type {*|Array|!webdriver.promise.Promise}
             */
            wayPointsUsedForSearch = wayPointsUsedForSearch.map(function (wayPointUsedForSearch) {
               return wayPointUsedForSearch.coordinates;
            });

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

            var deSerializedQuery = stateService.deserializeQuery(),
                wayPoints = deSerializedQuery.wayPoints,
                areasToAvoid = deSerializedQuery.areasToAvoid;

                //wayPoints = deSerializedQuery.wayPoints.map(function (wayPoint) {
                //    return wayPoint.coordinates;
                //}),
                //areasToAvoid = deSerializedQuery.areasToAvoid.map(function (areaToAvoid) {
                //    return areaToAvoid.boundingBox;
                //});

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