angular.module('navigationApp.controllers').controller('PageController',
    ["$scope", '$sce', "routingService", 'colorThemesService', function($scope) {

    'use strict';

    $scope.centerPosition = {
        latitude: 52.51083,
        longitude: 13.45264
    };

    $scope.$on('')

    $scope.pageReady = function () {
        $scope.ready = true;
    };
}]);