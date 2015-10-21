angular.module('navigationApp.controllers').controller('PageController', ["$scope", "routingService", function($scope, routingService) {

    'use strict';

    var collectRoutes = function (routes) {
        $scope.routes = $scope.routes.concat(routes);
    };

    $scope.routes = [];

    $scope.from = '53.33951,15.03696';
    $scope.to = '52.51083,13.45264';

    $scope.getRoute = function () {

        $scope.routes = [];

        (routingService.calculateWithTrafficDisabled($scope.from, $scope.to)).then(collectRoutes);
        (routingService.calculateWithTrafficEnabled($scope.from, $scope.to)).then(collectRoutes);
    };

    $scope.pageReady = function () {
        $scope.ready = 'ready';
    };
}]);