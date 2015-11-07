angular.module('navigationApp.controllers').controller('PageController',
    ["$scope", '$sce', "routingService", 'colorThemesService', function($scope, $sce, routingService, colorThemesService) {

    'use strict';

    var collectRoutes = function (routes, theme) {

        for (var i = 0, l = routes.length; i < l; i++) {
            routes[i].color = colorThemesService.getColor(theme);
            routingService.saveRoute(routes[i]);
        }

        $scope.proposedRoutes = routingService.getResults();
    };

    var collectRoutesWithTrafficDisabled = function (routes) {
        collectRoutes(routes, colorThemesService.NEGATIVE_THEME);
    };

    var collectRoutesWithTrafficEnabled = function (routes) {
        collectRoutes(routes, colorThemesService.POSITIVE_THEME);
    };

    $scope.trustedText = function (text) {
        return $sce.trustAsHtml(text);
    };

    $scope.selectRoute = function (route) {
        $scope.proposedRoutes = [];
        $scope.proposedRoutes[0] = route;

        $scope.activeRoute = route;

    };

    $scope.proposedRoutes = [];

    $scope.from = '52.40626,13.49667';
    $scope.to = '52.51083,13.45264';

    //$scope.wayPoints = ['52.46325,13.3882'];
    $scope.wayPoints = [];
    $scope.activeRoute = null;

    $scope.centerPosition = {
        latitude: 52.51083,
        longitude: 13.45264
    };

    $scope.getRoute = function () {

        if (!$scope.from || !$scope.to) {
            return;
        }

        routingService.clearResults();
        $scope.activeRoute = null;

        var waypoints = ([$scope.from].concat($scope.wayPoints)).concat([$scope.to]);

        (routingService.calculateWithTrafficDisabled(waypoints)).then(collectRoutesWithTrafficDisabled);
        (routingService.calculateWithTrafficEnabled(waypoints)).then(collectRoutesWithTrafficEnabled);
    };

    $scope.addWayPoint = function () {
        $scope.wayPoints.push('');
    };

    $scope.removeWayPoint = function (index) {
        $scope.wayPoints.splice(index, 1);
    };

    $scope.pageReady = function () {
        $scope.ready = true;
    };
}]);