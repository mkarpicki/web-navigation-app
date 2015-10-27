angular.module('navigationApp.controllers').controller('PageController', ["$scope", "routingService", 'colorThemesService', function($scope, routingService, colorThemesService) {

    'use strict';

    var collectRoutes = function (routes, theme) {

        for (var i = 0, l = routes.length; i < l; i++) {
            routes[i].color = colorThemesService.getColor(theme);
        }

        $scope.proposedRoutes = $scope.proposedRoutes.concat(routes);
    };

    var collectRoutesWithTrafficDisabled = function (routes) {
        collectRoutes(routes, colorThemesService.NEGATIVE_THEME);
    };
    var collectRoutesWithTrafficEnabled = function (routes) {
        collectRoutes(routes, colorThemesService.POSITIVE_THEME);
    };


    $scope.proposedRoutes = [];

    $scope.from = '53.33951,15.03696';
    $scope.to = '52.51083,13.45264';

    $scope.centerPosition = {
        latitude: 52.51083,
        longitude: 13.45264
    };

    $scope.getRoute = function () {

        $scope.proposedRoutes = [];

        (routingService.calculateWithTrafficDisabled($scope.from, $scope.to)).then(collectRoutesWithTrafficDisabled);
        (routingService.calculateWithTrafficEnabled($scope.from, $scope.to)).then(collectRoutesWithTrafficEnabled);
    };

    $scope.pageReady = function () {
        $scope.ready = 'ready';
    };
}]);