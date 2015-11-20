angular.module('navigationApp.controllers').controller('PageController',
    ["$scope", '$location', 'events', 'queryParserService', function($scope, $location, events, queryParserService) {

    'use strict';

    $scope.centerPosition = {
        latitude: 52.51083,
        longitude: 13.45264
    };

    $scope.$on(events.ADD_START_POINT, function (event, position) {

        console.log('add_start_point');

        var waypoints = queryParserService.deserializeWayPoints($location.search());

        waypoints[0] = position.latitude + ',' + position.longitude;

        var query = queryParserService.serializeWayPoints(waypoints);

        $location.url('/?' + query);
    });

    $scope.pageReady = function () {
        $scope.ready = true;
    };
}]);