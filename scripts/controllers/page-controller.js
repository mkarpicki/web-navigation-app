angular.module('navigationApp.controllers').controller('PageController', ["$scope", "routingService", function($scope, routingService) {

    'use strict';

    $scope.from = '53.33951,15.03696';
    $scope.to = '52.51083,13.45264';

    $scope.getRoute = function () {
        routingService.calculateWithTrafficDisabled($scope.from, $scope.to);
        routingService.calculateWithTrafficEnabled($scope.from, $scope.to);
    };

    $scope.pageReady = function () {
        $scope.ready = 'ready';
    };
}]);