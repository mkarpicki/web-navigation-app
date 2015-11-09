angular.module('navigationApp.controllers').controller('FormController',
    ["$scope", '$interpolate', '$location', function($scope, $interpolate, $location) {

        'use strict';

        $scope.from = '52.40626,13.49667';
        $scope.to = '52.51083,13.45264';

        //$scope.wayPoints = ['52.46325,13.3882'];
        $scope.wayPoints = [];

        $scope.getRoute = function () {

            if (!$scope.from || !$scope.to) {
                return;
            }

            var allPoints = [$scope.from].concat($scope.wayPoints).concat($scope.to),
                waypointQuery = "{{separator}}waypoint{{i}}={{waypoint}}",
                exp = $interpolate(waypointQuery),
                separator = '',
                query = '';


            for (var i = 0, l = allPoints.length; i < l; i++) {

                query += exp({
                    separator: separator,
                    i: i,
                    waypoint: allPoints[i]
                });

                separator = '&';
            }

            $location.url('/search?' + query );

        };

        $scope.addWayPoint = function () {
            $scope.wayPoints.push('');
        };

        $scope.removeWayPoint = function (index) {
            $scope.wayPoints.splice(index, 1);
        };

    }]);